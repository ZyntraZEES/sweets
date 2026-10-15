(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const products = window.CC_PRODUCTS || [];
  const price = window.CC_FORMAT_PRICE || ((n) => `£${Number(n).toFixed(2)}`);
  const cartKey = 'cc-cart';

  function safeReadCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      return Array.isArray(cart) ? cart : [];
    } catch (_) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    if (window.CC_APP) window.CC_APP.updateCartCount();
    document.dispatchEvent(new CustomEvent('cc:cart-updated'));
  }

  function addToCart(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const cart = safeReadCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart(cart);
    if (window.CC_APP) window.CC_APP.showToast(`${product.name} added to your bag`);
  }

  function cardMarkup(product) {
    return `
      <article class="product-card">
        <a class="product-image-wrap" href="menu.html#${product.id}" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
          <span class="image-arrow" aria-hidden="true">↗</span>
        </a>
        <div class="product-info">
          <div class="product-meta"><span>${product.category}</span><span class="tiny-star">✦</span></div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-buy-row">
            <strong>${price(product.price)}</strong>
            <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag"><span>+</span> Add</button>
          </div>
        </div>
      </article>`;
  }

  function renderCards(target, list) {
    if (!target) return;
    if (!list.length) {
      target.innerHTML = '<div class="empty-results"><span>✦</span><h3>No desserts found</h3><p>Try another search or choose a different category.</p></div>';
      return;
    }
    target.innerHTML = list.map(cardMarkup).join('');
  }

  function openProductModal(product) {
    let modal = $('.product-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'product-modal';
      modal.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <button type="button" class="product-modal-backdrop" data-modal-close aria-label="Close product details"></button>
      <section class="product-modal-panel" role="dialog" aria-modal="true" aria-label="${product.name}">
        <button type="button" class="product-modal-close" data-modal-close aria-label="Close">×</button>
        <div class="product-modal-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-modal-copy">
          <p class="eyebrow">${product.category}</p>
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <div class="product-modal-bottom"><strong>${price(product.price)}</strong><button type="button" class="button button-dark" data-add="${product.id}">Add to bag <span>↗</span></button></div>
          <small>Prototype item · final product details and price require shop approval.</small>
        </div>
      </section>`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const closeButton = $('.product-modal-close', modal);
    if (closeButton) closeButton.focus();
  }

  function closeProductModal() {
    const modal = $('.product-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function initProductGrids() {
    const featuredGrid = $('#featured-products');
    if (featuredGrid) renderCards(featuredGrid, products.filter((product) => product.featured).slice(0, 4));

    const menuGrid = $('#menu-products');
    if (!menuGrid) return;

    let activeCategory = 'All';
    let query = '';
    const filterContainer = $('[data-category-filters]');
    if (filterContainer) {
      filterContainer.innerHTML = (window.CC_CATEGORIES || ['All']).map((category, index) => `
        <button class="filter-chip ${index === 0 ? 'active' : ''}" type="button" data-category="${category}" aria-pressed="${index === 0}">${category}</button>
      `).join('');
      filterContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-category]');
        if (!button) return;
        activeCategory = button.dataset.category;
        $$('[data-category]', filterContainer).forEach((chip) => {
          const active = chip === button;
          chip.classList.toggle('active', active);
          chip.setAttribute('aria-pressed', String(active));
        });
        applyFilters();
      });
    }

    const search = $('[data-menu-search]');
    if (search) search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); applyFilters(); });

    function applyFilters() {
      const list = products.filter((product) => {
        const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
        const textMatch = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
        return categoryMatch && textMatch;
      });
      renderCards(menuGrid, list);
      const results = $('[data-result-count]');
      if (results) results.textContent = `${list.length} sweet ${list.length === 1 ? 'treat' : 'treats'}`;
    }
    applyFilters();
  }

  function renderCart() {
    const target = $('#cart-content');
    if (!target) return;
    const cart = safeReadCart();
    const rows = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);
    const subtotal = rows.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const delivery = subtotal > 0 ? 2.50 : 0;
    const total = subtotal + delivery;

    if (!rows.length) {
      target.innerHTML = `
        <div class="empty-cart-card">
          <div class="empty-cart-icon">♡</div>
          <p class="eyebrow">YOUR BAG IS WAITING</p>
          <h2>Something sweet belongs here.</h2>
          <p>Your bag is empty for now. Explore the menu and find your next favourite.</p>
          <a class="button button-dark" href="menu.html">Explore the menu <span>↗</span></a>
        </div>`;
      return;
    }

    const rowMarkup = rows.map((item) => `
      <article class="cart-line">
        <img src="${item.product.image}" alt="${item.product.name}">
        <div class="cart-line-main">
          <span class="cart-line-category">${item.product.category}</span>
          <h3>${item.product.name}</h3>
          <strong>${price(item.product.price)}</strong>
          <button type="button" class="text-button remove-item" data-remove="${item.id}">Remove</button>
        </div>
        <div class="quantity-stepper" aria-label="Quantity for ${item.product.name}">
          <button type="button" data-qty="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <strong class="line-total">${price(item.product.price * item.qty)}</strong>
      </article>`).join('');

    target.innerHTML = `
      <div class="cart-layout">
        <div class="cart-lines">
          <div class="cart-list-heading"><div><p class="eyebrow">YOUR SELECTION</p><h2>Your sweet bag <span>(${rows.reduce((sum, row) => sum + row.qty, 0)})</span></h2></div><a class="text-link" href="menu.html">Continue shopping ↗</a></div>
          ${rowMarkup}
          <p class="prototype-note"><span>i</span> Prototype checkout only. Items, prices and delivery charges need store approval.</p>
        </div>
        <aside class="order-summary">
          <p class="eyebrow">A LITTLE SUMMARY</p>
          <h2>Order total</h2>
          <div class="summary-row"><span>Subtotal</span><strong>${price(subtotal)}</strong></div>
          <div class="summary-row"><span>Estimated delivery</span><strong>${price(delivery)}</strong></div>
          <div class="summary-row total"><span>Total</span><strong>${price(total)}</strong></div>
          <p class="summary-small">Delivery amount is a demo value and will be confirmed before launch.</p>
          <a class="button button-dark button-full" href="checkout.html">Continue to checkout <span>↗</span></a>
          <div class="secure-line">◇ <span>Secure payment options can be integrated after approval.</span></div>
        </aside>
      </div>`;
  }

  document.addEventListener('click', (event) => {
    const closeModal = event.target.closest('[data-modal-close]');
    if (closeModal) { closeProductModal(); return; }

    const productLink = event.target.closest('.product-image-wrap');
    if (productLink) {
      const id = (productLink.getAttribute('href') || '').split('#').pop();
      const product = products.find((item) => item.id === id);
      if (product) { event.preventDefault(); openProductModal(product); return; }
    }

    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      addToCart(addButton.dataset.add);
      if (addButton.closest('.product-modal')) closeProductModal();
      return;
    }

    const qtyButton = event.target.closest('[data-qty]');
    if (qtyButton) {
      const cart = safeReadCart();
      const item = cart.find((entry) => entry.id === qtyButton.dataset.id);
      if (!item) return;
      item.qty += qtyButton.dataset.qty === 'plus' ? 1 : -1;
      saveCart(cart.filter((entry) => entry.qty > 0));
      renderCart();
      return;
    }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      saveCart(safeReadCart().filter((entry) => entry.id !== removeButton.dataset.remove));
      renderCart();
      if (window.CC_APP) window.CC_APP.showToast('Item removed from your bag');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProductModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    initProductGrids();
    renderCart();
  });
  document.addEventListener('cc:cart-updated', renderCart);

  window.CC_SHOP = { getCart: safeReadCart, saveCart, renderCart, products, price };
})();
