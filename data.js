/*
 * Cakes & Craves prototype catalog.
 * Prices and imagery are demo content and must be confirmed with the business before launch.
 */
window.CC_PRODUCTS = [
  { id: 'lotus-milk-cake', name: 'Lotus Biscoff Milk Cake', category: 'Milk Cakes', price: 5.95, image: 'assets/images/biscoff-milk-cake.webp', tag: 'Bestseller', description: 'Soft sponge soaked in three milks, finished with cream and a Biscoff drizzle.', featured: true },
  { id: 'pistachio-milk-cake', name: 'Pistachio Milk Cake', category: 'Milk Cakes', price: 6.45, image: 'assets/images/pistachio-milk-cake.webp', tag: 'House favourite', description: 'A rich, creamy milk cake with pistachio crunch and a delicate nutty finish.', featured: true },
  { id: 'oreo-milk-cake', name: 'Oreo Milk Cake', category: 'Milk Cakes', price: 5.95, image: 'assets/images/biscoff-milk-cake.webp', tag: 'Crowd pleaser', description: 'A nostalgic cookie-and-cream twist on a classic milk-soaked sponge.', featured: true },
  { id: 'ferrero-milk-cake', name: 'Ferrero Rocher Milk Cake', category: 'Milk Cakes', price: 6.45, image: 'assets/images/pistachio-milk-cake.webp', tag: 'Rich & indulgent', description: 'Chocolate cream, hazelnut notes and soft sponge in every spoonful.', featured: false },
  { id: 'chocolate-dream', name: 'Chocolate Dream Slice', category: 'Cakes & Slices', price: 5.25, image: 'assets/images/cookie-dough.webp', tag: 'Chocolate lover', description: 'A deeply chocolatey dessert for when only a proper treat will do.', featured: true },
  { id: 'red-velvet', name: 'Red Velvet Cake', category: 'Cakes & Slices', price: 4.95, image: 'assets/images/biscoff-milk-cake.webp', tag: 'Classic', description: 'Soft red velvet sponge paired with a smooth, tangy cream-cheese style frosting.', featured: false },
  { id: 'cookie-dough', name: 'Warm Cookie Dough', category: 'Warm Desserts', price: 6.45, image: 'assets/images/cookie-dough.webp', tag: 'Serve it warm', description: 'Freshly baked cookie dough with chocolate pieces and a scoop of vanilla ice cream.', featured: true },
  { id: 'churros', name: 'Churros & Chocolate Dip', category: 'Warm Desserts', price: 5.50, image: 'assets/images/cookie-dough.webp', tag: 'Perfect to share', description: 'Golden cinnamon-sugar churros with a warm chocolate dipping sauce.', featured: false },
  { id: 'kinder-milk-cake', name: 'Kinder Bueno Milk Cake', category: 'Milk Cakes', price: 6.45, image: 'assets/images/pistachio-milk-cake.webp', tag: 'Sweet favourite', description: 'Silky cream, chocolate-hazelnut notes and a tender milk-soaked sponge.', featured: false },
  { id: 'strawberry-shake', name: 'Strawberry Milkshake', category: 'Drinks', price: 4.95, image: 'assets/images/biscoff-milk-cake.webp', tag: 'Cool & creamy', description: 'A chilled, creamy strawberry shake to pair with your favourite dessert.', featured: false },
  { id: 'tiramisu-cup', name: 'Tiramisu Dessert Cup', category: 'Dessert Cups', price: 5.95, image: 'assets/images/cookie-dough.webp', tag: 'Coffee notes', description: 'Layers of soft sponge, cream and coffee-inspired flavour in a little cup.', featured: false },
  { id: 'chocolate-shake', name: 'Chocolate Milkshake', category: 'Drinks', price: 4.95, image: 'assets/images/pistachio-milk-cake.webp', tag: 'Extra chocolatey', description: 'A thick chocolate shake made for slow sips and sweet cravings.', featured: false }
];

window.CC_CATEGORIES = ['All', 'Milk Cakes', 'Cakes & Slices', 'Warm Desserts', 'Dessert Cups', 'Drinks'];
window.CC_FORMAT_PRICE = (amount) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
