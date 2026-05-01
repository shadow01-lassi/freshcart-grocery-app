const Header = {
  async render() {
    const el = document.getElementById('main-header');
    let cartCount = 0;
    let isLoggedIn = !!API.getToken();
    let userName = '';

    if (isLoggedIn) {
      try {
        const cart = await API.getCart();
        cartCount = cart.itemCount || 0;
        const me = await API.getMe();
        userName = me.user.name.split(' ')[0]; // First name
      } catch(e) {
        if (e.message.includes('login')) isLoggedIn = false;
      }
    }

    const hash = location.hash || '#/';
    el.className = 'header';
    el.innerHTML = `
      <div class="header-inner">
        <a href="#/" class="logo">
          <span class="logo-icon">🛒</span>
          <span>FreshCart</span>
        </a>
        <nav class="header-nav">
          <a href="#/" class="nav-link ${hash === '#/' ? 'active' : ''}">🏠 Shop</a>
          ${isLoggedIn ? `
            <a href="#/cart" class="nav-link ${hash === '#/cart' ? 'active' : ''}">
              🛍️ Cart
              ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
            </a>
            <a href="#/orders" class="nav-link ${hash.startsWith('#/orders') ? 'active' : ''}">📦 Orders</a>
            <span style="color:var(--text-secondary);font-size:0.9rem;margin-left:10px">Hi, ${userName}</span>
            <button onclick="logout()" class="btn btn-secondary btn-sm" style="margin-left:10px;padding:6px 12px">Logout</button>
          ` : `
            <a href="#/login" class="nav-link ${hash === '#/login' ? 'active' : ''}">🔑 Login</a>
            <a href="#/signup" class="btn btn-primary btn-sm" style="margin-left:10px">Sign Up</a>
          `}
        </nav>
      </div>
    `;
  }
};

function logout() {
  API.setToken(null);
  Toast.show('Logged out successfully');
  location.hash = '#/';
  Header.render();
}
