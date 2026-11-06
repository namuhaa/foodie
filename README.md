# 🍔 Foodie - Online Food Ordering Website (MERN Stack)

A modern, responsive, and full-featured **Online Food Ordering Platform** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, styled in a clean and professional **Blue & White** color theme.

---

## 🌟 Features Overview

### 🎨 Clean & Modern Blue & White Design
- **Theme**: Crisp royal blue primary palette (`#2563eb`), slate backgrounds, and pure white cards.
- **Responsiveness**: Fully optimized for mobile, tablet, laptop, and desktop screens.
- **Food Showcase**: High-definition, mouth-watering imagery for burgers, pizzas, biryanis, snacks, desserts, and drinks.
- **Interactions**: Smooth hover effects, interactive cards, micro-animations, and animated notifications.

### 🍽️ Frontend (Customer Experience)
1. **Header & Navigation**:
   - Foodie logo with express delivery badge.
   - Smooth navigation anchors to Home, Menu, Categories, Why Us, and Reviews.
   - Live cart button with dynamic badge counter and pulse animation.
   - Quick "Track Order" and "Admin" portal shortcuts.
   - Mobile-responsive drawer menu.
2. **Hero Section**:
   - Bold headline: **"Delicious Food, Delivered Fresh!"**
   - Value propositions: 30-Min Delivery, 4.9★ Average Rating, 100% Hygienic.
   - "Order Now" primary action button with smooth scrolling to menu.
   - Featured chef special food showcase with floating trust badges.
3. **Food Menu & Filter System**:
   - Categories: **Burger, Pizza, Biryani, Snacks, Desserts, Drinks**, and **All Dishes** with real-time dish counters.
   - Real-time search bar (by dish name, category, or description).
   - "Pure Veg" toggle filter.
   - Sort dropdown: Recommended/Featured, Price: Low to High, Price: High to Low, Highest Rated.
4. **Interactive Food Cards**:
   - High-resolution food photography.
   - Veg / Non-Veg badge indicators.
   - Star ratings and estimated preparation times.
   - Direct Add-to-Cart button with inline `[-] Qty [+]` controller when added.
5. **Slide-Out Cart & Pricing Engine**:
   - Itemized cart list with thumbnails, prices, and quantity controls.
   - Item deletion and "Clear All" features.
   - Promo coupon discounts: Use `FOODIE20` for 20% off or `WELCOME5` for $5 off!
   - Transparent bill breakdown: Subtotal, Delivery Fee (Free on orders $25+), Tax (5%), Promo Discount, and Total Amount.
6. **Checkout Modal**:
   - Customer details input: Full Name, Phone Number, Email, Street Address, City, Postal Code, and Special Instructions.
   - Payment method selection:
     - 💵 Cash on Delivery (COD)
     - 💳 Credit / Debit Card
     - 📱 UPI / Online Pay
   - Comprehensive input validation and friendly error handling.
7. **Order Confirmation & Live Tracking**:
   - Joyful success confirmation screen with generated unique Order ID (e.g. `#FD-48291`).
   - Order recap and estimated delivery time.
   - **Live Order Tracker**: 4-step progress stepper:
     1. `Order Placed` ➔ 2. `Preparing Food` ➔ 3. `Out for Delivery` ➔ 4. `Delivered`

---

### 🛡️ Admin Management Portal
- **Dashboard Metrics**: Live KPI cards showing Total Orders, Total Revenue, Food Items in Menu, and Pending Orders.
- **Manage Food Items**:
  - Add new dishes with name, category, price, image URL, rating, prep time, veg flag, and stock toggle.
  - Edit existing dishes.
  - Delete dishes.
  - "Reset Default Menu" button to reseed the original 24 dishes with a single click.
- **Manage Customer Orders**:
  - View all incoming customer orders with timestamp, customer contact, items, and total amount.
  - Live status dropdown: update order status (`Pending`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - Delete orders.
- **Database Status Panel**: Displays active database connection and engine details.

---

### ⚙️ Backend (Node.js, Express & MongoDB)
- **RESTful Architecture**:
  - `GET /api/foods`: Get all dishes (supports `category` and `search` query parameters).
  - `GET /api/foods/:id`: Get single dish by ID.
  - `POST /api/foods`: Add a new dish with full validation.
  - `PUT /api/foods/:id`: Update existing dish.
  - `DELETE /api/foods/:id`: Remove dish.
  - `GET /api/foods/categories`: Get categories with live dish counts.
  - `POST /api/foods/reseed`: Reset menu to sample dishes.
  - `POST /api/orders`: Place a new customer order with validation.
  - `GET /api/orders`: Retrieve all customer orders.
  - `GET /api/orders/:identifier`: Look up order by Order ID (e.g., `FD-10492`) or MongoDB `_id`.
  - `PUT /api/orders/:id/status`: Update order status.
  - `DELETE /api/orders/:id`: Delete order.
  - `GET /api/orders/stats`: Analytics for Admin dashboard.
  - `GET /api/health`: Health status and database connection info.
- **Dual-Mode Persistence**:
  - Connects to real MongoDB via Mongoose when available (`MONGODB_URI`).
  - Automatically falls back to high-performance internal memory storage if local MongoDB is stopped, ensuring that all features and tests work 100% smoothly without any crashes.

---

## 📁 Project Structure

```
mfef/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection and status reporter
│   ├── controllers/
│   │   ├── foodController.js   # Food CRUD logic
│   │   └── orderController.js  # Order creation, updates and analytics
│   ├── data/
│   │   ├── sampleFoods.js      # 24 gourmet sample dishes
│   │   └── store.js            # Dual-mode in-memory fallback store
│   ├── models/
│   │   ├── Food.js             # Mongoose Food schema
│   │   └── Order.js            # Mongoose Order schema
│   ├── routes/
│   │   ├── foodRoutes.js       # Food API routes
│   │   └── orderRoutes.js      # Order API routes
│   ├── server.js               # Express application entrypoint
│   ├── .env                    # Environment variables (configured)
│   ├── .env.example            # Environment variables template
│   └── package.json            # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg         # Foodie branded favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Header with logo, cart badge & links
│   │   │   ├── Hero.jsx                # Delicious Food Delivered Fresh hero
│   │   │   ├── CategoryFilter.jsx      # Burger, Pizza, Biryani, etc. pills
│   │   │   ├── FoodCard.jsx            # Food dish card with add/qty controls
│   │   │   ├── FoodMenu.jsx            # Menu grid, search, filters & sorters
│   │   │   ├── CartDrawer.jsx          # Slide-out cart & coupon engine
│   │   │   ├── CheckoutModal.jsx       # Checkout form with customer details
│   │   │   ├── OrderConfirmationModal.jsx # Order success celebration & recap
│   │   │   ├── OrderTrackerModal.jsx   # Real-time 4-step delivery tracker
│   │   │   ├── AdminModal.jsx          # Admin portal for dishes & orders
│   │   │   ├── Features.jsx            # Why Choose Foodie pillars
│   │   │   ├── Testimonials.jsx        # Customer reviews
│   │   │   ├── Footer.jsx              # Blue & White themed footer
│   │   │   └── Toast.jsx               # Floating toast notifications
│   │   ├── context/
│   │   │   └── CartContext.jsx         # Global cart state & persistence
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API service layer
│   │   ├── App.jsx                     # Root application component
│   │   ├── main.jsx                    # React entrypoint
│   │   └── index.css                   # Tailwind styles and animations
│   ├── index.html                      # HTML document template
│   ├── vite.config.js                  # Vite configuration with /api proxy
│   ├── tailwind.config.js              # Custom Blue & White theme colors
│   ├── postcss.config.js               # PostCSS config
│   ├── .env                            # Frontend environment variables
│   ├── .env.example                    # Frontend environment template
│   └── package.json                    # Frontend dependencies
│
├── package.json                        # Root workspace scripts
└── README.md                           # Documentation & guide
```

---

## 🚀 Step-by-Step Installation & Running Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/)
- Optional: Local [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Check the `.env` file in `backend/`:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/foodie_db
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The backend will run on **http://localhost:5000**.*

> **Connecting MongoDB**:
> - **Local MongoDB**: If MongoDB Community Server is installed on your computer, ensure the MongoDB service is started (`net start MongoDB` on Windows or `brew services start mongodb-community` on macOS).
> - **MongoDB Atlas**: Replace `MONGODB_URI` in `backend/.env` with your connection string:
>   ```ini
>   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodie_db?retryWrites=true&w=majority
>   ```
> - *Note*: If MongoDB is not yet running on your computer, the backend automatically uses its built-in memory store so that every single page, API, order, and admin feature continues to function smoothly.

---

### Step 2: Start the Frontend Application

1. Open a second terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing the Application

1. **Browse & Filter**:
   - Filter by categories: **Burger**, **Pizza**, **Biryani**, **Snacks**, **Desserts**, **Drinks**.
   - Use the **Search Bar** to search for items like "Truffle", "Biryani", "Cake", etc.
   - Toggle **Pure Veg** or sort by **Price: Low to High** or **Highest Rated**.
2. **Cart & Coupons**:
   - Click **Add** on any food card. Notice the card morphs into a quantity controller `[-] 1 [+]`.
   - Open the **Cart** in the top navigation bar.
   - Enter promo code `FOODIE20` and click **Apply** for 20% off!
3. **Checkout & Order**:
   - Click **Proceed to Checkout**.
   - Fill in your Name, Phone Number, and Delivery Address.
   - Select payment mode (e.g. Cash on Delivery) and click **Place Order**.
   - View your order confirmation with unique Order ID (e.g. `#FD-10492`).
4. **Live Order Tracking**:
   - Click **Track Live Delivery Status** to see the 4-step progress bar update in real-time.
5. **Admin Portal**:
   - Click the **Admin** button in the header.
   - In **Manage Food Items**: Click "+ Add New Dish" to add a custom food item, edit prices, or delete items.
   - In **Customer Orders**: Change any order's status to `Out for Delivery` or `Delivered`.
   - In **Database & System**: Check real-time MongoDB and API connectivity.


---

## 🌐 Production Deployment Guide

### Option A: Deploy with Render (Free & Recommended)
1. Push code to your GitHub repository:
   ```bash
   git remote add origin https://github.com/namuhaa/foodie.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Blueprint**.
3. Connect your `foodie` repository. Render automatically reads `render.yaml` to deploy:
   - `foodie-backend`: Web Service running Node.js / Express
   - `foodie-frontend`: Static Site running React
4. Add your `MONGODB_URI` environment variable in the backend service settings on Render.

### Option B: Deploy Frontend on Vercel & Backend on Render / Railway
1. **Backend**:
   - Create a new **Web Service** on Render or Railway pointing to the `backend` directory.
   - Build command: `npm install`
   - Start command: `npm start`
   - Add Environment Variable: `MONGODB_URI` with your MongoDB Atlas connection string.
2. **Frontend**:
   - Import the repo into [Vercel](https://vercel.com).
   - Root directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_BASE_URL` = Your backend URL (e.g. `https://foodie-api.onrender.com/api`).
