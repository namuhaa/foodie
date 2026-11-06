const mongoose = require('mongoose');
const Food = require('../models/Food');
const sampleFoods = require('../data/sampleFoods');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodie_db';
  console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    isConnected = true;
    console.log(`[Database] ✅ MongoDB connected successfully: ${conn.connection.host}`);

    // Seed database if Food collection is empty
    try {
      const count = await Food.countDocuments();
      if (count === 0) {
        console.log('[Database] 🌱 Seeding initial sample foods into MongoDB...');
        await Food.insertMany(sampleFoods);
        console.log(`[Database] ✅ Seeded ${sampleFoods.length} delicious food items!`);
      } else {
        console.log(`[Database] ℹ️ Found ${count} existing food items in MongoDB.`);
      }
    } catch (seedErr) {
      console.warn('[Database] Warning during sample seed check:', seedErr.message);
    }

    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] ⚠️ MongoDB connection could not be established (${error.message}).`);
    console.log('[Database] 🚀 Activating internal high-performance store fallback so all features, APIs, and Admin actions work immediately!');
    console.log('[Database] 👉 To connect your real MongoDB, ensure MongoDB service is running or provide MONGODB_URI in backend/.env');
    return false;
  }
};

const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  state: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'Internal Memory Store (Active)',
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodie_db'
});

module.exports = { connectDB, getDBStatus };
