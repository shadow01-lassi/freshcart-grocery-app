const API = {
  getToken() {
    return localStorage.getItem('freshcart_token');
  },
  setToken(token) {
    if (token) localStorage.setItem('freshcart_token', token);
    else localStorage.removeItem('freshcart_token');
  },
  async _fetch(url, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { headers, ...options });
    if (!res.ok) {
      if (res.status === 401 && !url.includes('/api/auth/login')) {
        this.setToken(null);
        location.hash = '#/login';
        throw new Error('Please login to continue');
      }
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  // Auth
  login(email, password) {
    return this._fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  signup(name, email, password) {
    return this._fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },
  getMe() {
    return this._fetch('/api/auth/me');
  },

  // Products
  getProducts(query = '') { return this._fetch(`/api/products${query ? '?' + query : ''}`); },
  getProduct(id) { return this._fetch(`/api/products/${id}`); },
  getCategories() { return this._fetch('/api/categories'); },

  // Cart
  getCart() { return this._fetch('/api/cart'); },
  addToCart(productId, quantity = 1) { return this._fetch('/api/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }); },
  updateCartItem(productId, quantity) { return this._fetch(`/api/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }); },
  removeFromCart(productId) { return this._fetch(`/api/cart/${productId}`, { method: 'DELETE' }); },
  clearCart() { return this._fetch('/api/cart', { method: 'DELETE' }); },

  // Orders
  placeOrder(deliveryInfo) { return this._fetch('/api/orders', { method: 'POST', body: JSON.stringify({ deliveryInfo }) }); },
  getOrders() { return this._fetch('/api/orders'); },
  getOrder(id) { return this._fetch(`/api/orders/${id}`); }
};
