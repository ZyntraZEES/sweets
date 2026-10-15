(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem('cc-cart') || '[]');
      return Array.isArray(cart) ? cart : [];
    } catch (_) {
      return [];
    }
  }

  function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
    $$('.cart-count').forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle('is-empty', count === 0);
      el.setAttribute('aria-label', `${count} items in cart`);
    });
  }

  let toastTimer;
  function showToast(message) {
    let toast = $('.toast-message');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  window.CC_APP = { $, $$, getCart, updateCartCount, showToast };

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const toggle = $('[data-menu-toggle]');
    const mobileNav = $('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        mobileNav.classList.toggle('is-open', !expanded);
        document.body.classList.toggle('nav-open', !expanded);
      });
      $$('.mobile-nav a', mobileNav).forEach((link) => {
        link.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('nav-open');
        });
      });
    }

    const page = document.body.dataset.page;
    $$('[data-nav-page]').forEach((link) => {
      if (link.dataset.navPage === page) link.classList.add('active');
    });

    const revealItems = $$('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('revealed'));
    }

    $$('[data-demo-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        form.reset();
        showToast('Thanks! This is a prototype form — no message was sent.');
      });
    });

    $$('[data-current-year]').forEach((el) => el.textContent = String(new Date().getFullYear()));
  });
})();
