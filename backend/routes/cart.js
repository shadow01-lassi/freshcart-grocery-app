const express = require('express');
const router = express.Router();
const store = require('../store');
const products = require('../data/products.json');
const { authMiddleware } = require('./auth');

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Helper: Enrich cart items with product details
function enrichCart(cartItems) {
  return cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product: product || null };
  }).filter(item => item.product !== null);
}

function calculateTotal(enrichedItems) {
  return enrichedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

// GET /api/cart
router.get('/', (req, res) => {
  const userId = req.user.id;
  const cartItems = store.getCart(userId);
  const enriched = enrichCart(cartItems);
  const total = calculateTotal(enriched);

  res.json({
    items: enriched,
    itemCount: store.getCartItemCount(userId),
    total: Math.round(total * 100) / 100
  });
});

// POST /api/cart
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId) return res.status(400).json({ error: 'productId is required' });
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.inStock) return res.status(400).json({ error: 'Product is out of stock' });

  store.addToCart(userId, productId, quantity || 1);
  const cartItems = store.getCart(userId);
  const enriched = enrichCart(cartItems);

  res.status(201).json({
    message: `${product.name} added to cart`,
    items: enriched,
    itemCount: store.getCartItemCount(userId),
    total: Math.round(calculateTotal(enriched) * 100) / 100
  });
});

// PUT /api/cart/:productId
router.put('/:productId', (req, res) => {
  const userId = req.user.id;
  const { quantity } = req.body;
  if (quantity === undefined || quantity === null) return res.status(400).json({ error: 'quantity is required' });

  const result = store.updateCartItem(userId, req.params.productId, parseInt(quantity));
  if (result === null) return res.status(404).json({ error: 'Item not found in cart' });

  const enriched = enrichCart(result);
  res.json({
    items: enriched,
    itemCount: store.getCartItemCount(userId),
    total: Math.round(calculateTotal(enriched) * 100) / 100
  });
});

// DELETE /api/cart/:productId
router.delete('/:productId', (req, res) => {
  const userId = req.user.id;
  if (req.params.productId === 'all') {
    store.clearCart(userId);
    return res.json({ items: [], itemCount: 0, total: 0 });
  }

  const result = store.removeFromCart(userId, req.params.productId);
  const enriched = enrichCart(result);
  res.json({
    items: enriched,
    itemCount: store.getCartItemCount(userId),
    total: Math.round(calculateTotal(enriched) * 100) / 100
  });
});

// DELETE /api/cart
router.delete('/', (req, res) => {
  const userId = req.user.id;
  store.clearCart(userId);
  res.json({ items: [], itemCount: 0, total: 0 });
});

module.exports = router;
