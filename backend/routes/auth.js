const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const JWT_SECRET = 'freshcart-super-secret-key-123'; // In production, use environment variable

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. Please sign in.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

  // Check if user exists
  if (store.getUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = store.createUser({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  });

  // Create token
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, name: user.name, email: user.email } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  // Find user
  const user = store.getUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });

  // Check password
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ error: 'Invalid email or password' });

  // Create token
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name, email: user.email } });
});

// GET /api/auth/me (Get current user)
router.get('/me', authMiddleware, (req, res) => {
  const user = store.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = { router, authMiddleware };
