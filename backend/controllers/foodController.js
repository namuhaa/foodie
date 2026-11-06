const mongoose = require('mongoose');
const Food = require('../models/Food');
const store = require('../data/store');
const sampleFoods = require('../data/sampleFoods');

// Helper to check if Mongoose is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all food items (supports category & search query)
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let query = {};

      if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { description: regex },
          { category: regex }
        ];
      }

      const foods = await Food.find(query).sort({ isFeatured: -1, createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: foods.length,
        source: 'mongodb',
        data: foods
      });
    }

    // In-memory fallback
    const foods = store.getFoods(category, search);
    return res.status(200).json({
      success: true,
      count: foods.length,
      source: 'memory_store',
      data: foods
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching food items',
      error: error.message
    });
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      const food = await Food.findById(id);
      if (!food) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.status(200).json({ success: true, data: food });
    }

    const food = store.getFoodById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    return res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error('Error fetching food by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching food item',
      error: error.message
    });
  }
};

// @desc    Add a new food item
// @route   POST /api/foods
// @access  Public (or Admin)
const createFood = async (req, res) => {
  try {
    const { name, description, price, category, image, rating, prepTime, isVeg, inStock, isFeatured } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, and image'
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    const foodData = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category,
      image: image.trim(),
      rating: rating ? Number(rating) : 4.5,
      prepTime: prepTime || '20-25 min',
      isVeg: Boolean(isVeg),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isFeatured: Boolean(isFeatured)
    };

    if (isMongoConnected()) {
      const newFood = await Food.create(foodData);
      return res.status(201).json({
        success: true,
        message: 'Food item created successfully in MongoDB',
        data: newFood
      });
    }

    const newFood = store.addFood(foodData);
    return res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: newFood
    });
  } catch (error) {
    console.error('Error creating food:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating food item',
      error: error.message
    });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Public (or Admin)
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price !== undefined) {
      const parsedPrice = parseFloat(updateData.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }
      updateData.price = parsedPrice;
    }

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      const updatedFood = await Food.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
      if (!updatedFood) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Food item updated successfully',
        data: updatedFood
      });
    }

    const updatedFood = store.updateFood(id, updateData);
    if (!updatedFood) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: updatedFood
    });
  } catch (error) {
    console.error('Error updating food:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating food item',
      error: error.message
    });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Public (or Admin)
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      const deletedFood = await Food.findByIdAndDelete(id);
      if (!deletedFood) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Food item deleted successfully from MongoDB',
        data: deletedFood
      });
    }

    const deleted = store.deleteFood(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting food:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting food item',
      error: error.message
    });
  }
};

// @desc    Get food categories with counts
// @route   GET /api/foods/categories
// @access  Public
const getCategories = async (req, res) => {
  const predefinedCategories = ['Burger', 'Pizza', 'Biryani', 'Snacks', 'Desserts', 'Drinks'];
  try {
    let foods = [];
    if (isMongoConnected()) {
      foods = await Food.find({}, 'category');
    } else {
      foods = store.foods;
    }

    const counts = {};
    predefinedCategories.forEach((cat) => {
      counts[cat] = foods.filter((f) => f.category.toLowerCase() === cat.toLowerCase()).length;
    });

    return res.status(200).json({
      success: true,
      categories: predefinedCategories,
      counts,
      total: foods.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset / reseed sample foods
// @route   POST /api/foods/reseed
// @access  Public (Admin)
const reseedFoods = async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Food.deleteMany({});
      const inserted = await Food.insertMany(sampleFoods);
      return res.status(200).json({
        success: true,
        message: `Successfully reseeded ${inserted.length} foods in MongoDB!`,
        count: inserted.length
      });
    }

    const resetList = store.resetFoods();
    return res.status(200).json({
      success: true,
      message: `Successfully reseeded ${resetList.length} foods in internal store!`,
      count: resetList.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  reseedFoods
};
