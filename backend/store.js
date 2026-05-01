const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const cartsFile = path.join(dataDir, 'carts.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Ensure data directory and files exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
if (!fs.existsSync(cartsFile)) fs.writeFileSync(cartsFile, '{}'); // { userId: [cartItems] }
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');

// Helper to read/write
function readData(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return Array.isArray(JSON.parse(fs.readFileSync(file, 'utf8') || '[]')) ? [] : {}; }
}
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const store = {
  // ─── Users ──────────────────────────────────────────────────
  getUsers() { return readData(usersFile); },
  getUserByEmail(email) { return this.getUsers().find(u => u.email === email); },
  getUserById(id) { return this.getUsers().find(u => u.id === id); },
  createUser(user) {
    const users = this.getUsers();
    users.push(user);
    writeData(usersFile, users);
    return user;
  },

  // ─── Cart (Per User) ────────────────────────────────────────
  getCart(userId) {
    const carts = readData(cartsFile);
    return carts[userId] || [];
  },
  saveCart(userId, cart) {
    const carts = readData(cartsFile);
    carts[userId] = cart;
    writeData(cartsFile, carts);
  },
  addToCart(userId, productId, quantity = 1) {
    const cart = this.getCart(userId);
    const existing = cart.find(item => item.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ productId, quantity });
    this.saveCart(userId, cart);
    return cart;
  },
  updateCartItem(userId, productId, quantity) {
    let cart = this.getCart(userId);
    const item = cart.find(item => item.productId === productId);
    if (!item) return null;
    if (quantity <= 0) cart = cart.filter(i => i.productId !== productId);
    else item.quantity = quantity;
    this.saveCart(userId, cart);
    return cart;
  },
  removeFromCart(userId, productId) {
    let cart = this.getCart(userId);
    cart = cart.filter(item => item.productId !== productId);
    this.saveCart(userId, cart);
    return cart;
  },
  clearCart(userId) {
    this.saveCart(userId, []);
    return [];
  },
  getCartItemCount(userId) {
    return this.getCart(userId).reduce((sum, item) => sum + item.quantity, 0);
  },

  // ─── Orders (Per User) ──────────────────────────────────────
  getOrders(userId) {
    const orders = readData(ordersFile);
    return orders.filter(o => o.userId === userId).reverse();
  },
  getOrderById(userId, orderId) {
    const orders = readData(ordersFile);
    return orders.find(o => o.id === orderId && o.userId === userId) || null;
  },
  createOrder(orderData) {
    const orders = readData(ordersFile);
    orders.push(orderData);
    writeData(ordersFile, orders);
    return orderData;
  }
};

module.exports = store;
