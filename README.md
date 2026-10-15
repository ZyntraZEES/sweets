# Cakes & Craves — Premium Website Prototype

A responsive, multi-page front-end prototype for a dessert shop. Built with plain HTML, CSS and JavaScript. No Node.js, build tools or package installation are required.

## Run it

1. Extract the ZIP folder.
2. Open `index.html` in Chrome, Edge or Firefox.
3. Browse **Menu**, use filters/search, add desserts to the bag, edit quantities, and go through the demo checkout.

For the most reliable browser behaviour, VS Code users can install/use the **Live Server** extension and choose **Open with Live Server** on `index.html`. The website itself has no build step.

## Pages

- `index.html` — homepage
- `menu.html` — searchable, filterable menu
- `deals.html` — proposed dessert bundle cards
- `about.html` — brand story concept
- `contact.html` — business details and demo contact form
- `cart.html` — shopping bag with quantity controls and summary
- `checkout.html` — demo delivery/collection form and order summary
- `order-confirmation.html` — local demo order confirmation

## Animation and interactions

- Scroll reveals automatically animate static sections and menu cards rendered by JavaScript.
- Hero and internal page headers use staggered entrance transitions.
- Product/deal cards include a subtle hover lift, fine-pointer tilt, and image sheen.
- Buttons have click ripple feedback, the bag count briefly animates after cart updates, and the mobile menu items stagger into view.
- The sticky header responds to scrolling, with a scroll progress bar and back-to-top control.
- `prefers-reduced-motion` is respected for accessibility.

## Where to edit

- `css/style.css` — entire site style, responsive rules and colour palette
- `js/data.js` — menu products, categories, demo prices and descriptions
- `js/app.js` — navigation, toast messages and small shared UI behaviour
- `js/shop.js` — menu filtering, product cards, cart and quantities
- `js/checkout.js` — checkout flow and local demo order
- `js/confirmation.js` — confirmation screen content
- `assets/images/` — locally bundled dessert image assets

## Important prototype notes

- This project is a front-end concept only. It does **not** transmit real orders or payments, send emails, or connect to a live admin panel.
- Product names, prices, descriptions, proposed bundle offers, photos, hours, contact details and location must be checked and approved by the business before launch.
- Cart/order demo state is stored locally in the browser. It is not a database and should not be used for real customer orders.
- Google Fonts are loaded from Google Fonts when internet access is available; fallback fonts are provided.
