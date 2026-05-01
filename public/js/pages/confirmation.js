// Order confirmation page
const ConfirmationPage = {
  async render(orderId) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    try {
      const data = await API.getOrder(orderId);
      const order = data.order;

      main.innerHTML = `
        <div class="page">
          <div class="confirmation-page">
            <div class="confirm-icon">🎉</div>
            <h1 class="confirm-title">Order Confirmed!</h1>
            <p class="confirm-subtitle">Your groceries are on their way. Estimated delivery: ${order.estimatedDelivery}</p>
            <div class="order-card">
              <h3>📦 Order Details</h3>
              <div class="summary-row"><span class="label">Order ID</span><span class="order-id">${order.id}</span></div>
              <div class="summary-row"><span class="label">Status</span><span style="color:var(--accent);font-weight:600">✅ ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></div>
              <div class="summary-row"><span class="label">Date</span><span>${new Date(order.createdAt).toLocaleDateString()}</span></div>
              <hr style="border:none;border-top:1px solid var(--border);margin:1rem 0">
              <h3>🛒 Items</h3>
              <ul class="order-items-list">
                ${order.items.map(item => `
                  <li><span>${item.name} × ${item.quantity}</span><span>$${item.subtotal.toFixed(2)}</span></li>
                `).join('')}
              </ul>
              <div class="summary-row total" style="margin-top:1rem"><span class="label">Total</span><span class="value">$${order.total.toFixed(2)}</span></div>
            </div>
            <div class="order-card">
              <h3>🚚 Delivery To</h3>
              <p><strong>${order.deliveryInfo.name}</strong></p>
              <p style="color:var(--text-secondary)">${order.deliveryInfo.address}</p>
              <p style="color:var(--text-secondary)">${order.deliveryInfo.phone}</p>
            </div>
            <button class="btn btn-primary" onclick="location.hash='#/'">🛒 Continue Shopping</button>
          </div>
        </div>`;
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h2>Order not found</h2><button class="btn btn-primary" onclick="location.hash=\'#/\'">Back to Shop</button></div>';
    }
  }
};

// Orders list page (reuse for #/orders)
const OrdersPage = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
    try {
      const data = await API.getOrders();
      if (data.orders.length === 0) {
        main.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-state-icon">📦</div><h2>No orders yet</h2><p>Place your first order!</p><button class="btn btn-primary" onclick="location.hash='#/'">Browse Products</button></div></div>`;
        return;
      }
      main.innerHTML = `
        <div class="page">
          <h2 class="section-title">📦 Your Orders</h2>
          ${data.orders.map(order => `
            <div class="order-card" style="cursor:pointer;margin-bottom:1rem" onclick="location.hash='#/confirmation/${order.id}'">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <span class="order-id">${order.id}</span>
                  <span style="color:var(--text-muted);margin-left:12px">${new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div style="color:var(--accent);font-weight:700">$${order.total.toFixed(2)}</div>
              </div>
              <div style="color:var(--text-secondary);font-size:0.9rem;margin-top:6px">${order.items.length} items • ${order.status}</div>
            </div>
          `).join('')}
        </div>`;
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><h2>Failed to load orders</h2></div>';
    }
  }
};
