const express = require('express');
const path = require('path');
const productRoutes = require('./backend/routes/products');
const cartRoutes = require('./backend/routes/cart');
const orderRoutes = require('./backend/routes/orders');
const { router: authRoutes } = require('./backend/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`\n  🛒  FreshCart Grocery App is running!\n`);
  console.log(`  ➜  Local:   http://localhost:${PORT}`);
  console.log(`  ➜  API:     http://localhost:${PORT}/api/products\n`);
});
