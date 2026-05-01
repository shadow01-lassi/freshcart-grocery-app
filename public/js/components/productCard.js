// Product card component
const ProductCard = {
  render(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
    return `
      <div class="product-card" onclick="location.hash='#/product/${product.id}'" id="product-${product.id}">
        <img class="product-card-img" src="${product.image}" alt="${product.name}"
             onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#2d2d44)';this.style.display='flex';this.alt='${product.name}'">
        <div class="product-card-body">
          <div class="product-card-cat">${product.category}</div>
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-desc">${product.description}</div>
          <div class="product-card-footer">
            <div class="product-card-price">$${product.price.toFixed(2)} <span class="product-card-unit">/ ${product.unit}</span></div>
            <div class="product-card-rating">${stars} ${product.rating}</div>
          </div>
          <button class="btn-add-card" onclick="event.stopPropagation(); addToCartQuick('${product.id}')" id="add-${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    `;
  }
};

async function addToCartQuick(productId) {
  try {
    const result = await API.addToCart(productId, 1);
    Toast.show(result.message);
    Header.render();
  } catch(e) {
    Toast.show('Failed to add item', 'error');
  }
}
