(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const money = window.CC_FORMAT_PRICE || ((n) => `£${Number(n).toFixed(2)}`);

  document.addEventListener('DOMContentLoaded', () => {
    let order = null;
    try { order = JSON.parse(localStorage.getItem('cc-last-order') || 'null'); }
    catch (_) { order = null; }
    if (!order || !order.demo) {
      const lead = $('.confirmation-lead');
      if (lead) lead.textContent = 'This is a preview confirmation screen. Try adding products to your bag and completing the demo checkout to see a sample order here.';
      const ref = $('#confirmation-reference');
      if (ref) ref.textContent = 'CC-DEMO';
      return;
    }
    if ($('#confirmation-reference')) $('#confirmation-reference').textContent = order.reference || 'CC-DEMO';
    const details = $('#confirmation-details');
    if (details) {
      const itemSummary = (order.items || []).map((item) => `${item.qty} × ${item.name}`).join(' · ');
      details.textContent = `${order.name || 'Customer'} · ${order.fulfilment || 'Delivery'} · ${money(order.total || 0)} total. ${itemSummary}`;
    }
  });
})();
