// Checkout page
const CheckoutPage = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    try {
      const cart = await API.getCart();
      if (cart.items.length === 0) {
        location.hash = '#/cart';
        return;
      }
      const delivery = cart.total >= 25 ? 0 : 3.99;
      const grandTotal = (cart.total + delivery).toFixed(2);

      main.innerHTML = `
        <div class="page">
          <button class="back-btn" onclick="location.hash='#/cart'">← Back to Cart</button>
          <h2 class="section-title">📋 Checkout</h2>
          <div class="checkout-page">
            <div class="form-section">
              <h2>🚚 Delivery Information</h2>
              <form id="checkout-form" onsubmit="CheckoutPage.placeOrder(event)">
                <div class="form-group">
                  <label for="del-name">Full Name *</label>
                  <input type="text" id="del-name" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                  <label for="del-phone">Phone Number *</label>
                  <input type="tel" id="del-phone" required placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                  <label for="del-email">Email (optional)</label>
                  <input type="email" id="del-email" placeholder="Enter your email address">
                </div>
                <div class="form-group">
                  <label for="del-address">Delivery Address *</label>
                  <textarea id="del-address" required placeholder="Enter your full delivery address"></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block" id="place-order-btn">
                  🛒 Place Order — $${grandTotal}
                </button>
              </form>
            </div>
            <div class="cart-summary">
              <h3>Order Summary</h3>
              ${cart.items.map(item => `
                <div class="summary-row">
                  <span class="label">${item.product.name} × ${item.quantity}</span>
                  <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              <div class="summary-row"><span class="label">Delivery</span><span>${delivery === 0 ? '<span style="color:var(--accent)">FREE</span>' : '$' + delivery.toFixed(2)}</span></div>
              <div class="summary-row total"><span class="label">Total</span><span class="value">$${grandTotal}</span></div>
            </div>
          </div>
        </div>`;
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><h2>Error loading checkout</h2></div>';
    }
  },

  async placeOrder(e) {
    e.preventDefault();
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    const deliveryInfo = {
      name: document.getElementById('del-name').value,
      phone: document.getElementById('del-phone').value,
      email: document.getElementById('del-email').value,
      address: document.getElementById('del-address').value
    };

    try {
      const result = await API.placeOrder(deliveryInfo);
      Toast.show('Order placed successfully!');
      Header.render();
      location.hash = '#/confirmation/' + result.order.id;
    } catch(e) {
      Toast.show('Failed to place order', 'error');
      btn.disabled = false;
      btn.textContent = '🛒 Place Order';
    }
  }
};
