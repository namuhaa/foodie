const mongoose = require('mongoose');
const Order = require('../models/Order');
const store = require('../data/store');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Generate readable order ID e.g. FD-64821
const generateOrderId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `FD-${randomNum}`;
};

// @desc    Place a new customer order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, deliveryFee, tax, totalAmount, paymentMethod } = req.body;

    // Validation
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full customer details: Name, Phone Number, and Delivery Address are required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to place an order.'
      });
    }

    if (totalAmount === undefined || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total amount'
      });
    }

    const orderData = {
      orderId: generateOrderId(),
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : 'Springfield',
        postalCode: customer.postalCode ? customer.postalCode.trim() : '',
        notes: customer.notes ? customer.notes.trim() : ''
      },
      items: items.map((item) => ({
        foodId: item._id || item.foodId || item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image
      })),
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee) || 0,
      tax: Number(tax) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      orderStatus: 'Pending',
      estimatedDeliveryTime: '30-40 min'
    };

    if (isMongoConnected()) {
      const order = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully! We are preparing your delicious food.',
        data: order
      });
    }

    // Fallback in-memory
    const order = store.addOrder(orderData);
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! We are preparing your delicious food.',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all orders (for Admin)
// @route   GET /api/orders
// @access  Public (or Admin)
const getOrders = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        source: 'mongodb',
        data: orders
      });
    }

    const orders = store.getOrders();
    return res.status(200).json({
      success: true,
      count: orders.length,
      source: 'memory_store',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get single order by orderId or MongoDB _id (For Order Tracking)
// @route   GET /api/orders/:identifier
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (isMongoConnected()) {
      let order = null;
      if (mongoose.isValidObjectId(identifier)) {
        order = await Order.findById(identifier);
      }
      if (!order) {
        order = await Order.findOne({
          orderId: { $regex: new RegExp(`^${identifier.trim()}$`, 'i') }
        });
      }

      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Order "${identifier}" not found. Please check your Order ID.`
        });
      }

      return res.status(200).json({ success: true, data: order });
    }

    const order = store.getOrderById(identifier);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${identifier}" not found. Please check your Order ID.`
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order by identifier:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (isMongoConnected()) {
      let updatePayload = { orderStatus };
      if (orderStatus === 'Delivered') {
        updatePayload.paymentStatus = 'Completed';
      }

      let order = null;
      if (mongoose.isValidObjectId(id)) {
        order = await Order.findByIdAndUpdate(id, updatePayload, { new: true });
      }
      if (!order) {
        order = await Order.findOneAndUpdate(
          { orderId: new RegExp(`^${id.trim()}$`, 'i') },
          updatePayload,
          { new: true }
        );
      }

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.status(200).json({
        success: true,
        message: `Order status updated to "${orderStatus}"`,
        data: order
      });
    }

    const updated = store.updateOrderStatus(id, orderStatus);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}"`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public (Admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let deleted = null;
      if (mongoose.isValidObjectId(id)) {
        deleted = await Order.findByIdAndDelete(id);
      }
      if (!deleted) {
        deleted = await Order.findOneAndDelete({ orderId: new RegExp(`^${id.trim()}$`, 'i') });
      }

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    }

    const deleted = store.deleteOrder(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

// @desc    Get dashboard analytics / statistics
// @route   GET /api/orders/stats
// @access  Public (Admin)
const getStats = async (req, res) => {
  try {
    let ordersList = [];
    if (isMongoConnected()) {
      ordersList = await Order.find();
    } else {
      ordersList = store.orders;
    }

    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const pendingOrders = ordersList.filter((o) => o.orderStatus === 'Pending').length;
    const deliveredOrders = ordersList.filter((o) => o.orderStatus === 'Delivered').length;
    const preparingOrders = ordersList.filter((o) => o.orderStatus === 'Preparing').length;
    const outForDeliveryOrders = ordersList.filter((o) => o.orderStatus === 'Out for Delivery').length;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        deliveredOrders,
        preparingOrders,
        outForDeliveryOrders
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getStats
};
