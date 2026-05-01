# 🛒 FreshCart Grocery Application

FreshCart is a premium, full-stack single-page application (SPA) built for online grocery shopping. It features a beautiful dark-mode glassmorphism UI, a complete shopping cart system, user authentication, and a file-based persistent local database.

## ✨ Features

- **User Authentication**: Secure Sign-Up and Login functionality using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Product Catalog**: Browse 30+ grocery items across 6 categories (Fruits, Vegetables, Dairy, Bakery, Beverages, Snacks) with search and filtering capabilities.
- **Shopping Cart**: Add, update, and remove items with real-time total calculations.
- **Checkout Flow**: Securely place orders and enter delivery information (requires login).
- **Persistent Local Database**: No external database required! Users, Carts, and Orders are automatically and permanently saved to local JSON files (`backend/data/`).
- **Premium UI/UX**: Custom-designed Vanilla CSS styling with glassmorphism effects, responsive CSS grid, and smooth hover animations.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Custom Styling), Vanilla JavaScript (SPA Routing).
- **Backend**: Node.js, Express.js.
- **Database**: Local JSON Storage (Node `fs` module).
- **Authentication**: `jsonwebtoken`, `bcryptjs`.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shadow01-lassi/freshcart-grocery-app.git
   cd freshcart-grocery-app
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the local Express server:
```bash
npm start
```

Once the server is running, open your browser and navigate to:
**http://localhost:3000**

## 📂 Project Structure

\`\`\`text
├── backend/
│   ├── data/             # Local JSON Database (Products, Users, Carts, Orders)
│   ├── routes/           # Express API Routes (Auth, Products, Cart, Orders)
│   └── store.js          # Database Interaction Logic
├── public/
│   ├── css/              # UI Styles (styles.css)
│   ├── js/
│   │   ├── components/   # Reusable UI Components (Header, ProductCard, Toast)
│   │   ├── pages/        # Page Views (Home, Auth, Cart, Checkout, etc.)
│   │   ├── api.js        # Frontend Fetch API Wrapper
│   │   └── app.js        # Custom Hash-based SPA Router
│   └── index.html        # Main Entry Point
├── server.js             # Express Server Setup
└── package.json          # Project Dependencies
\`\`\`

## 📝 License
This project is open-source and available under the MIT License.
