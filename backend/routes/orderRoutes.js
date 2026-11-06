const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getStats
} = require('../controllers/orderController');

router.get('/stats', getStats);

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:identifier')
  .get(getOrderById);

router.route('/:id/status')
  .put(updateOrderStatus);

router.route('/:id')
  .delete(deleteOrder);

module.exports = router;
