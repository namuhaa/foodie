const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true
      },
      email: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true
      },
      city: {
        type: String,
        default: 'City'
      },
      postalCode: {
        type: String
      },
      notes: {
        type: String,
        default: ''
      }
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must contain at least one item'
      }
    },
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'UPI'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    estimatedDeliveryTime: {
      type: String,
      default: '30-40 min'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
