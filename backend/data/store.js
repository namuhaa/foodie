const sampleFoods = require('./sampleFoods');

// In-memory fallback store when MongoDB is not running locally
class MemoryStore {
  constructor() {
    this.foods = sampleFoods.map((item, index) => ({
      _id: `mem_food_${index + 1}`,
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    this.orders = [
      {
        _id: 'mem_order_1',
        orderId: 'FD-10492',
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+1 (555) 234-5678',
          address: '742 Evergreen Terrace, Apt 4B',
          city: 'Springfield',
          postalCode: '97477',
          notes: 'Please ring bell twice.'
        },
        items: [
          {
            foodId: 'mem_food_1',
            name: 'Classic Cheeseburger',
            price: 8.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
          },
          {
            foodId: 'mem_food_13',
            name: 'Crispy Golden Truffle Fries',
            price: 5.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80'
          },
          {
            foodId: 'mem_food_21',
            name: 'Fresh Mint & Lime Mojito',
            price: 4.49,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 32.95,
        deliveryFee: 0,
        tax: 1.65,
        totalAmount: 34.60,
        paymentMethod: 'Card',
        paymentStatus: 'Completed',
        orderStatus: 'Preparing',
        estimatedDeliveryTime: '25-30 min',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        _id: 'mem_order_2',
        orderId: 'FD-10381',
        customer: {
          name: 'Alex Miller',
          email: 'alex.m@example.com',
          phone: '+1 (555) 987-6543',
          address: '1204 Pine View Boulevard',
          city: 'Springfield',
          postalCode: '97477',
          notes: 'Leave at front porch.'
        },
        items: [
          {
            foodId: 'mem_food_9',
            name: 'Hyderabadi Chicken Dum Biryani',
            price: 13.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
          },
          {
            foodId: 'mem_food_17',
            name: 'Molten Belgian Chocolate Lava Cake',
            price: 6.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 20.98,
        deliveryFee: 2.99,
        tax: 1.05,
        totalAmount: 25.02,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Out for Delivery',
        estimatedDeliveryTime: '10-15 min',
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ];
  }

  // Foods
  getFoods(category, search) {
    let list = [...this.foods];
    if (category && category !== 'All') {
      list = list.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getFoodById(id) {
    return this.foods.find((f) => f._id.toString() === id.toString());
  }

  addFood(data) {
    const newFood = {
      _id: `mem_food_${Date.now()}`,
      rating: 4.5,
      prepTime: '20-25 min',
      inStock: true,
      isFeatured: false,
      tags: [],
      ...data,
      price: Number(data.price),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.foods.unshift(newFood);
    return newFood;
  }

  updateFood(id, data) {
    const idx = this.foods.findIndex((f) => f._id.toString() === id.toString());
    if (idx === -1) return null;
    this.foods[idx] = {
      ...this.foods[idx],
      ...data,
      price: data.price !== undefined ? Number(data.price) : this.foods[idx].price,
      updatedAt: new Date().toISOString()
    };
    return this.foods[idx];
  }

  deleteFood(id) {
    const idx = this.foods.findIndex((f) => f._id.toString() === id.toString());
    if (idx === -1) return false;
    this.foods.splice(idx, 1);
    return true;
  }

  resetFoods() {
    this.foods = sampleFoods.map((item, index) => ({
      _id: `mem_food_${index + 1}`,
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    return this.foods;
  }

  // Orders
  getOrders() {
    return [...this.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(idOrOrderId) {
    return this.orders.find(
      (o) =>
        o._id.toString() === idOrOrderId.toString() ||
        o.orderId.toLowerCase() === idOrOrderId.toLowerCase()
    );
  }

  addOrder(data) {
    const newOrder = {
      _id: `mem_order_${Date.now()}`,
      orderId: `FD-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentStatus: data.paymentMethod === 'COD' ? 'Pending' : 'Completed',
      orderStatus: 'Pending',
      estimatedDeliveryTime: '30-40 min',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(idOrOrderId, status) {
    const order = this.getOrderById(idOrOrderId);
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }

  deleteOrder(idOrOrderId) {
    const idx = this.orders.findIndex(
      (o) =>
        o._id.toString() === idOrOrderId.toString() ||
        o.orderId.toLowerCase() === idOrOrderId.toLowerCase()
    );
    if (idx === -1) return false;
    this.orders.splice(idx, 1);
    return true;
  }
}

module.exports = new MemoryStore();
