const App = {
  init() {
    window.addEventListener('hashchange', () => App.route());
    App.route();
  },

  async route() {
    const hash = location.hash || '#/';
    await Header.render();

    if (hash === '#/' || hash === '#') {
      HomePage.render();
    } else if (hash === '#/login') {
      AuthPages.renderLogin();
    } else if (hash === '#/signup') {
      AuthPages.renderSignup();
    } else if (hash.startsWith('#/product/')) {
      const id = hash.replace('#/product/', '');
      ProductPage.render(id);
    } else {
      // For cart, checkout, orders, we need authentication
      if (!API.getToken()) {
        location.hash = '#/login';
        return;
      }
      if (hash === '#/cart') CartPage.render();
      else if (hash === '#/checkout') CheckoutPage.render();
      else if (hash.startsWith('#/confirmation/')) ConfirmationPage.render(hash.replace('#/confirmation/', ''));
      else if (hash === '#/orders') OrdersPage.render();
      else HomePage.render();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
document.addEventListener('DOMContentLoaded', () => App.init());
