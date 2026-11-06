const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Foodie API',
    version: '1.0.0',
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('Foodie API is running! Access endpoints at /api/foods and /api/orders');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Foodie Server running at http://localhost:${PORT}`);
  console.log(`🍔 Foods API:   http://localhost:${PORT}/api/foods`);
  console.log(`📦 Orders API:  http://localhost:${PORT}/api/orders`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});

module.exports = app;
