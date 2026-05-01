// Cart item row component
const CartItem = {
  render(item) {
    const p = item.product;
    const subtotal = (p.price * item.quantity).toFixed(2);
    return `
      <div class="cart-item" id="cart-item-${p.id}">
        <img class="cart-item-img" src="${p.image}" alt="${p.name}"
             onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#2d2d44)'">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price.toFixed(2)} <span class="cart-item-unit">/ ${p.unit}</span></div>
        </div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" onclick="updateCartQty('${p.id}', ${item.quantity - 1})">−</button>
          <div class="cart-qty-val">${item.quantity}</div>
          <button class="cart-qty-btn" onclick="updateCartQty('${p.id}', ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-subtotal">$${subtotal}</div>
        <button class="cart-item-remove" onclick="removeCartItem('${p.id}')" title="Remove">✕</button>
      </div>
    `;
  }
};
