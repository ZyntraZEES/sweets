(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const products = window.CC_PRODUCTS || [];
  const money = window.CC_FORMAT_PRICE || ((n) => `£${Number(n).toFixed(2)}`);
  const cartKey = 'cc-cart';

  function readCart() {
    try { return JSON.parse(localStorage.getItem(cartKey) || '[]'); }
    catch (_) { return []; }
  }

  function getItems() {
    return readCart().map((row) => ({ ...row, product: products.find((product) => product.id === row.id) }))
      .filter((row) => row.product && Number(row.qty) > 0);
  }

  function renderSummary() {
    const items = getItems();
    const target = $('#checkout-items');
    const form = $('#checkout-form');
    const submit = $('.checkout-submit');
    const subtotal = items.reduce((sum, row) => sum + row.product.price * row.qty, 0);
    const collection = $('input[name="fulfilment"]:checked')?.value === 'Collection';
    const delivery = subtotal > 0 && !collection ? 2.50 : 0;

    if (target) {
      if (!items.length) {
        target.innerHTML = '<div class="checkout-empty"><p>Your bag is empty. Add a dessert before checkout.</p><a class="text-link" href="menu.html">Explore the menu ↗</a></div>';
        if (submit) submit.disabled = true;
        if (form) form.setAttribute('data-empty-cart', 'true');
      } else {
        target.innerHTML = items.map((row) => `
          <div class="checkout-item">
            <img src="${row.product.image}" alt="${row.product.name}">
            <div><strong>${row.product.name}</strong><small>Qty ${row.qty} · ${money(row.product.price)} each</small></div>
            <b>${money(row.product.price * row.qty)}</b>
          </div>`).join('');
        if (submit) submit.disabled = false;
        if (form) form.removeAttribute('data-empty-cart');
      }
    }
    if ($('#checkout-subtotal')) $('#checkout-subtotal').textContent = money(subtotal);
    if ($('#checkout-delivery')) $('#checkout-delivery').textContent = money(delivery);
    if ($('#checkout-total')) $('#checkout-total').textContent = money(subtotal + delivery);
  }

  function updateFulfilmentFields() {
    const collection = $('input[name="fulfilment"]:checked')?.value === 'Collection';
    const addressFields = $('#address-fields');
    if (addressFields) {
      addressFields.hidden = collection;
      addressFields.querySelectorAll('input').forEach((input) => {
        input.required = !collection;
        if (collection) input.value = '';
      });
    }
    renderSummary();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderSummary();
    document.querySelectorAll('input[name="fulfilment"]').forEach((radio) => radio.addEventListener('change', updateFulfilmentFields));
    updateFulfilmentFields();

    const form = $('#checkout-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const items = getItems();
      if (!items.length) {
        window.CC_APP?.showToast('Your bag is empty. Add a dessert first.');
        return;
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subtotal = items.reduce((sum, row) => sum + row.product.price * row.qty, 0);
      const fulfilment = data.get('fulfilment') || 'Delivery';
      const delivery = fulfilment === 'Delivery' ? 2.50 : 0;
      const reference = `CC-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const order = {
        reference,
        name: `${data.get('firstName') || ''} ${data.get('lastName') || ''}`.trim(),
        email: data.get('email') || '',
        phone: data.get('phone') || '',
        fulfilment,
        address: fulfilment === 'Delivery' ? [data.get('address'), data.get('city'), data.get('postcode')].filter(Boolean).join(', ') : 'Store collection (location to be confirmed)',
        notes: data.get('notes') || '',
        items: items.map((row) => ({ id: row.id, name: row.product.name, qty: row.qty, price: row.product.price })),
        subtotal,
        delivery,
        total: subtotal + delivery,
        createdAt: new Date().toISOString(),
        demo: true
      };
      try {
        localStorage.setItem('cc-last-order', JSON.stringify(order));
        localStorage.setItem(cartKey, '[]');
      } catch (_) {
        window.CC_APP?.showToast('Storage is unavailable in this browser session. Try opening the project in a browser.');
        return;
      }
      window.location.href = 'order-confirmation.html';
    });
  });
})();
