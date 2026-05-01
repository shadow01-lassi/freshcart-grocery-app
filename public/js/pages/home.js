// Home page - Product listing with categories and search
const HomePage = {
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading products...</p></div>';

    try {
      const [productsData, catData] = await Promise.all([
        API.getProducts(),
        API.getCategories()
      ]);
      const categories = ['All', ...catData.categories];
      const activeCategory = HomePage._activeCategory || 'All';
      const searchTerm = HomePage._searchTerm || '';

      main.innerHTML = `
        <div class="page">
          <div class="hero">
            <h1>Fresh Groceries, <em>Delivered Fast</em></h1>
            <p>Premium quality groceries at your fingertips. Browse, add to cart, and checkout in minutes.</p>
            <div class="search-bar">
              <input type="text" id="search-input" placeholder="Search for groceries..." value="${searchTerm}">
              <button onclick="HomePage.search()">Search</button>
            </div>
          </div>
          <div class="category-tabs" id="cat-tabs">
            ${categories.map(c => `
              <button class="cat-tab ${c === activeCategory ? 'active' : ''}"
                      onclick="HomePage.filterCategory('${c}')" id="tab-${c}">${this.getCatEmoji(c)} ${c}</button>
            `).join('')}
          </div>
          <div class="product-grid" id="product-grid">
            ${productsData.products.map(p => ProductCard.render(p)).join('')}
          </div>
          ${productsData.products.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <h2>No products found</h2>
              <p>Try a different search term or category.</p>
            </div>
          ` : ''}
        </div>
      `;

      // Attach search on Enter
      document.getElementById('search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') HomePage.search();
      });
    } catch(e) {
      main.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h2>Failed to load products</h2><p>Please refresh the page.</p></div>';
    }
  },

  getCatEmoji(cat) {
    const emojis = { All: '🛒', Fruits: '🍎', Vegetables: '🥦', Dairy: '🥛', Bakery: '🍞', Beverages: '☕', Snacks: '🍿' };
    return emojis[cat] || '📦';
  },

  _activeCategory: 'All',
  _searchTerm: '',

  async filterCategory(cat) {
    HomePage._activeCategory = cat;
    const search = HomePage._searchTerm;
    const params = new URLSearchParams();
    if (cat !== 'All') params.set('category', cat);
    if (search) params.set('search', search);

    try {
      const data = await API.getProducts(params.toString());
      document.getElementById('product-grid').innerHTML =
        data.products.length > 0
          ? data.products.map(p => ProductCard.render(p)).join('')
          : '<div class="empty-state"><div class="empty-state-icon">🔍</div><h2>No products found</h2></div>';
      // Update active tab
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + cat)?.classList.add('active');
    } catch(e) {}
  },

  async search() {
    const input = document.getElementById('search-input');
    HomePage._searchTerm = input.value.trim();
    HomePage.filterCategory(HomePage._activeCategory);
  }
};
