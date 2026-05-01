const AuthPages = {
  renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page" style="max-width:500px;margin:4rem auto">
        <div class="form-section">
          <h2 style="justify-content:center;font-size:1.8rem;margin-bottom:2rem">Welcome Back 👋</h2>
          <form id="login-form" onsubmit="AuthPages.handleLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="login-email" required placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="login-pass" required placeholder="Enter your password">
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.5rem">Log In</button>
          </form>
          <p style="text-align:center;margin-top:1.5rem;color:var(--text-secondary)">
            Don't have an account? <a href="#/signup">Sign up here</a>
          </p>
        </div>
      </div>
    `;
  },

  renderSignup() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page" style="max-width:500px;margin:4rem auto">
        <div class="form-section">
          <h2 style="justify-content:center;font-size:1.8rem;margin-bottom:2rem">Create Account 🚀</h2>
          <form id="signup-form" onsubmit="AuthPages.handleSignup(event)">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="signup-name" required placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="signup-email" required placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="signup-pass" required placeholder="Create a password" minlength="6">
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.5rem">Sign Up</button>
          </form>
          <p style="text-align:center;margin-top:1.5rem;color:var(--text-secondary)">
            Already have an account? <a href="#/login">Log in here</a>
          </p>
        </div>
      </div>
    `;
  },

  async handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.textContent = 'Logging in...';
    try {
      const res = await API.login(
        document.getElementById('login-email').value,
        document.getElementById('login-pass').value
      );
      API.setToken(res.token);
      Toast.show('Logged in successfully');
      location.hash = '#/';
    } catch(err) {
      Toast.show(err.message, 'error');
      btn.disabled = false; btn.textContent = 'Log In';
    }
  },

  async handleSignup(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.textContent = 'Creating account...';
    try {
      const res = await API.signup(
        document.getElementById('signup-name').value,
        document.getElementById('signup-email').value,
        document.getElementById('signup-pass').value
      );
      API.setToken(res.token);
      Toast.show('Account created successfully');
      location.hash = '#/';
    } catch(err) {
      Toast.show(err.message, 'error');
      btn.disabled = false; btn.textContent = 'Sign Up';
    }
  }
};
