const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/categories — List all unique categories
router.get('/', (req, res) => {
  // Check if this is the /api/categories route
  if (req.baseUrl === '/api/categories') {
    const categories = [...new Set(products.map(p => p.category))];
    return res.json({ categories });
  }

  // Otherwise it's /api/products — List all products with optional filters
  let filtered = [...products];

  // Filter by category
  const { category, search } = req.query;
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search by name
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  res.json({
    count: filtered.length,
    products: filtered
  });
});

// GET /api/products/:id — Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
