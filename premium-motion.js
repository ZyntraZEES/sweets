/* Cakes & Craves — premium motion system. No dependencies. */
(() => {
  'use strict';

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canMove = () => !reduceMotionQuery.matches;
  const body = document.body;
  body.classList.add('motion-ready');

  // Let the first paint settle before running the page's entrance choreography.
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('page-ready')));

  // Scroll progress, header polish and back-to-top control.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.appendChild(progress);

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.innerHTML = '<span aria-hidden="true">↑</span>';
  body.appendChild(topButton);

  let ticking = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${pct})`;
    topButton.classList.toggle('is-visible', window.scrollY > 500);
    document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 20);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  updateScrollUI();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: canMove() ? 'smooth' : 'auto' }));

  // Reveal static and dynamically-rendered content (especially menu cards).
  let revealObserver = null;
  if (canMove() && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -28px 0px' });
  }

  const revealSelector = '.product-card, .deal-card, .category-card, .contact-detail-item, .cart-line, .story-value, .contact-info-card, .feature-card, .section-heading, .value-list > div';
  function animateNodes(root = document) {
    const nodes = [];
    if (root instanceof Element && root.matches(revealSelector)) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll(revealSelector));
    nodes.forEach((el, index) => {
      // The base reveal system already owns .reveal elements; do not compete with it.
      if (el.classList.contains('reveal') || el.dataset.motionBound === 'true') return;
      el.dataset.motionBound = 'true';
      el.classList.add('motion-item');
      const siblings = el.parentElement ? [...el.parentElement.children].filter((child) => child.matches(revealSelector)) : [];
      el.style.setProperty('--motion-delay', `${(siblings.indexOf(el) % 4) * 85}ms`);
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('motion-in');
    });
  }
  animateNodes();
  if ('MutationObserver' in window) {
    const contentObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) animateNodes(node);
      }));
    });
    document.querySelectorAll('#featured-products, #menu-products, .deal-grid, #cart-content').forEach((root) => {
      contentObserver.observe(root, { childList: true, subtree: true });
    });
    // Dynamic roots may replace their children but the roots themselves remain stable.
    contentObserver.observe(document.body, { childList: true, subtree: true });
  }

  // A subtle 3D tilt on precision pointers only; CSS keeps a gentle lift on hover.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  function bindTilt(root = document) {
    if (!canMove() || !finePointer.matches) return;
    const cards = [];
    if (root instanceof Element && root.matches('.product-card, .deal-card')) cards.push(root);
    if (root.querySelectorAll) cards.push(...root.querySelectorAll('.product-card, .deal-card'));
    cards.forEach((card) => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 2.2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 2.2).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
  bindTilt();
  if ('MutationObserver' in window) {
    const tiltObserver = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) bindTilt(node);
    })));
    tiltObserver.observe(document.body, { childList: true, subtree: true });
  }

  // Button ripple is decorative only; click behaviour remains with the original handler.
  document.addEventListener('click', (event) => {
    const target = event.target.closest('.button, .add-button, .filter-chip, .menu-toggle');
    if (!target || !canMove()) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'motion-ripple';
    ripple.style.left = `${event.clientX ? event.clientX - rect.left : rect.width / 2}px`;
    ripple.style.top = `${event.clientY ? event.clientY - rect.top : rect.height / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    window.setTimeout(() => ripple.remove(), 850);
  }, true);

  // Feedback when the shopping bag updates.
  document.addEventListener('cc:cart-updated', () => {
    document.querySelectorAll('.cart-count').forEach((badge) => {
      badge.classList.remove('is-bumping');
      void badge.offsetWidth;
      if (canMove()) badge.classList.add('is-bumping');
      badge.addEventListener('animationend', () => badge.classList.remove('is-bumping'), { once: true });
    });
  });

  // Keyboard usability: Escape closes overlays and the mobile navigation.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const modal = document.querySelector('.product-modal.is-open');
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      body.classList.remove('modal-open');
    }
    const toggle = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      body.classList.remove('nav-open');
    }
  });

  // Keep interactions accessible if a visitor changes their OS motion preference mid-session.
  function updateMotionPreference() {
    if (canMove()) return;
    document.querySelectorAll('.motion-item').forEach((el) => el.classList.add('motion-in'));
    document.querySelectorAll('.product-card, .deal-card').forEach((card) => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  }
  reduceMotionQuery.addEventListener?.('change', updateMotionPreference);
})();
