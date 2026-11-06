const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide food name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['Burger', 'Pizza', 'Biryani', 'Snacks', 'Desserts', 'Drinks']
    },
    image: {
      type: String,
      required: [true, 'Please provide image URL']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    prepTime: {
      type: String,
      default: '20-25 min'
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Add index for fast category and text search
foodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Food', foodSchema);
