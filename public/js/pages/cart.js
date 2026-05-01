// Cart page
const CartPage = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    try {
      const cart = await API.getCart();
      if (cart.items.length === 0) {
        main.innerHTML = `
          <div class="page">
            <div class="empty-state">
              <div class="empty-state-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start adding some fresh groceries!</p>
              <button class="btn btn-primary" onclick="location.hash='#/'">Browse Products</button>
            </div>
          </div>`;
        return;
      }

      const delivery = cart.total >= 25 ? 0 : 3.99;
      const grandTotal = (cart.total + delivery).toFixed(2);

      main.innerHTML = `
        <div class="page">
          <h2 class="section-title">🛍️ Your Cart (${cart.itemCount} items)</h2>
          <div class="cart-page">
            <div class="cart-items">
              ${cart.items.map(item => CartItem.render(item)).join('')}
            </div>
            <div class="cart-summary">
              <h3>Order Summary</h3>
              <div class="summary-row"><span class="label">Subtotal</span><span>$${cart.total.toFixed(2)}</span></div>
              <div class="summary-row"><span class="label">Delivery</span><span>${delivery === 0 ? '<span style="color:var(--accent)">FREE</span>' : '$' + delivery.toFixed(2)}</span></div>
              ${delivery > 0 ? '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">Free delivery on orders over $25</div>' : ''}
              <div class="summary-row total"><span class="label">Total</span><span class="value">$${grandTotal}</span></div>
              <button class="btn btn-primary btn-block" style="margin-top:1.2rem" onclick="location.hash='#/checkout'" id="checkout-btn">
                Proceed to Checkout →
              </button>
              <button class="btn btn-secondary btn-block" style="margin-top:8px" onclick="location.hash='#/'">Continue Shopping</button>
              <button class="btn btn-danger btn-sm btn-block" style="margin-top:8px" onclick="clearCartAll()">Clear Cart</button>
            </div>
          </div>
        </div>`;
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h2>Failed to load cart</h2></div>';
    }
  }
};

async function updateCartQty(productId, qty) {
  try {
    if (qty <= 0) { await API.removeFromCart(productId); }
    else { await API.updateCartItem(productId, qty); }
    CartPage.render();
    Header.render();
  } catch(e) { Toast.show('Failed to update cart', 'error'); }
}

async function removeCartItem(productId) {
  try {
    await API.removeFromCart(productId);
    Toast.show('Item removed');
    CartPage.render();
    Header.render();
  } catch(e) { Toast.show('Failed to remove item', 'error'); }
}

async function clearCartAll() {
  try {
    await API.clearCart();
    Toast.show('Cart cleared');
    CartPage.render();
    Header.render();
  } catch(e) { Toast.show('Failed to clear cart', 'error'); }
}
