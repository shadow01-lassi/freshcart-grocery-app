const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const products = require('../data/products.json');
const { authMiddleware } = require('./auth');

// Apply auth middleware to all order routes
router.use(authMiddleware);

// POST /api/orders
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { deliveryInfo } = req.body;

  if (!deliveryInfo || !deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone) {
    return res.status(400).json({ error: 'Delivery info is required (name, address, phone)' });
  }

  const cartItems = store.getCart(userId);
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
  }

  const orderItems = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : 'Unknown Product',
      price: product ? product.price : 0,
      unit: product ? product.unit : '',
      image: product ? product.image : '',
      quantity: item.quantity,
      subtotal: product ? Math.round(product.price * item.quantity * 100) / 100 : 0
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = {
    id: 'ORD-' + uuidv4().slice(0, 8).toUpperCase(),
    userId, // link order to user
    items: orderItems,
    total: Math.round(total * 100) / 100,
    deliveryInfo: {
      name: deliveryInfo.name.trim(),
      address: deliveryInfo.address.trim(),
      phone: deliveryInfo.phone.trim(),
      email: deliveryInfo.email ? deliveryInfo.email.trim() : ''
    },
    status: 'confirmed',
    estimatedDelivery: getEstimatedDelivery(),
    createdAt: new Date().toISOString()
  };

  store.createOrder(order);
  store.clearCart(userId);

  res.status(201).json({ message: 'Order placed successfully!', order });
});

// GET /api/orders
router.get('/', (req, res) => {
  const userId = req.user.id;
  const orders = store.getOrders(userId);
  res.json({ count: orders.length, orders });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const userId = req.user.id;
  const order = store.getOrderById(userId, req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

function getEstimatedDelivery() {
  const now = new Date();
  const min = new Date(now.getTime() + 30 * 60000);
  const max = new Date(now.getTime() + 60 * 60000);
  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${formatTime(min)} - ${formatTime(max)}`;
}

module.exports = router;
