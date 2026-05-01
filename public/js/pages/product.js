// Product detail page
const ProductPage = {
  _qty: 1,

  async render(productId) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    try {
      const data = await API.getProduct(productId);
      const p = data.product;
      ProductPage._qty = 1;
      const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

      main.innerHTML = `
        <div class="page">
          <button class="back-btn" onclick="history.back()">← Back to Shop</button>
          <div class="product-detail">
            <img class="product-detail-img" src="${p.image}" alt="${p.name}"
                 onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#2d2d44)'">
            <div class="product-detail-info">
              <div class="product-detail-cat">${p.category}</div>
              <h1 class="product-detail-name">${p.name}</h1>
              <div class="product-detail-price">$${p.price.toFixed(2)} <span class="product-card-unit">/ ${p.unit}</span></div>
              <div class="product-detail-meta">
                <div class="meta-item"><span style="color:var(--warning)">${stars}</span> ${p.rating} rating</div>
                <div class="meta-item">${p.inStock ? '✅ In Stock' : '❌ Out of Stock'}</div>
              </div>
              <p class="product-detail-desc">${p.description}</p>
              <div class="quantity-control">
                <button class="qty-btn" onclick="ProductPage.changeQty(-1)">−</button>
                <div class="qty-display" id="qty-val">1</div>
                <button class="qty-btn" onclick="ProductPage.changeQty(1)">+</button>
              </div>
              <button class="btn btn-primary btn-block" onclick="ProductPage.addToCart('${p.id}')" id="add-to-cart-btn">
                🛒 Add to Cart — $<span id="total-price">${p.price.toFixed(2)}</span>
              </button>
              <button class="btn btn-secondary btn-block" style="margin-top:10px" onclick="location.hash='#/'">
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      `;
      ProductPage._price = p.price;
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h2>Product not found</h2><button class="btn btn-primary" onclick="location.hash=\'#/\'">Back to Shop</button></div>';
    }
  },

  changeQty(delta) {
    ProductPage._qty = Math.max(1, ProductPage._qty + delta);
    document.getElementById('qty-val').textContent = ProductPage._qty;
    document.getElementById('total-price').textContent = (ProductPage._price * ProductPage._qty).toFixed(2);
  },

  async addToCart(productId) {
    try {
      const result = await API.addToCart(productId, ProductPage._qty);
      Toast.show(result.message);
      Header.render();
    } catch(e) {
      Toast.show('Failed to add to cart', 'error');
    }
  }
};
