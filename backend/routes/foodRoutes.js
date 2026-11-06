const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  reseedFoods
} = require('../controllers/foodController');

router.get('/categories', getCategories);
router.post('/reseed', reseedFoods);

router.route('/')
  .get(getFoods)
  .post(createFood);

router.route('/:id')
  .get(getFoodById)
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;
