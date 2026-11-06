import { sampleFoods } from '../data/sampleFoods';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Client Fallback Store
const STORAGE_FOODS_KEY = 'foodie_client_foods';
const STORAGE_ORDERS_KEY = 'foodie_client_orders';

function getStoredFoods() {
  try {
    const raw = localStorage.getItem(STORAGE_FOODS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(STORAGE_FOODS_KEY, JSON.stringify(sampleFoods));
  return sampleFoods;
}

function saveStoredFoods(foods) {
  try {
    localStorage.setItem(STORAGE_FOODS_KEY, JSON.stringify(foods));
  } catch (e) {}
}

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const initial = [
    {
      _id: 'ord_demo_1',
      orderId: 'FD-10492',
      customer: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        email: 'sarah@example.com',
        address: '742 Evergreen Terrace, Apt 4B',
        city: 'Springfield'
      },
      items: [
        { name: 'Classic Cheeseburger', price: 8.99, quantity: 2 },
        { name: 'Crispy Golden Truffle Fries', price: 5.99, quantity: 1 }
      ],
      totalAmount: 23.97,
      paymentMethod: 'Card',
      paymentStatus: 'Completed',
      orderStatus: 'Preparing',
      estimatedDeliveryTime: '25-30 min',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ];
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
}

export const api = {
  // Foods
  async getFoods(category = '', search = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search && search.trim() !== '') params.append('search', search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${BASE_URL}/foods${query}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback
    let list = getStoredFoods();
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
    return { success: true, count: list.length, data: list };
  },

  async getFoodById(id) {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const foods = getStoredFoods();
    const item = foods.find((f) => (f._id || f.id) === id);
    return item ? { success: true, data: item } : { success: false, message: 'Item not found' };
  },

  async createFood(foodData) {
    try {
      const res = await fetch(`${BASE_URL}/foods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const foods = getStoredFoods();
    const newFood = {
      _id: `food_${Date.now()}`,
      rating: 4.8,
      prepTime: '20-25 min',
      inStock: true,
      ...foodData,
      price: Number(foodData.price)
    };
    foods.unshift(newFood);
    saveStoredFoods(foods);
    return { success: true, data: newFood };
  },

  async updateFood(id, foodData) {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const foods = getStoredFoods();
    const idx = foods.findIndex((f) => (f._id || f.id) === id);
    if (idx !== -1) {
      foods[idx] = { ...foods[idx], ...foodData };
      saveStoredFoods(foods);
      return { success: true, data: foods[idx] };
    }
    return { success: false, message: 'Dish not found' };
  },

  async deleteFood(id) {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    let foods = getStoredFoods();
    foods = foods.filter((f) => (f._id || f.id) !== id);
    saveStoredFoods(foods);
    return { success: true };
  },

  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/foods/categories`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const foods = getStoredFoods();
    const categories = ['Burger', 'Pizza', 'Biryani', 'Snacks', 'Desserts', 'Drinks'];
    const counts = {};
    categories.forEach((cat) => {
      counts[cat] = foods.filter((f) => f.category.toLowerCase() === cat.toLowerCase()).length;
    });
    return { success: true, categories, counts, total: foods.length };
  },

  async reseedFoods() {
    try {
      const res = await fetch(`${BASE_URL}/foods/reseed`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}

    saveStoredFoods(sampleFoods);
    return { success: true, count: sampleFoods.length, message: 'Menu restored successfully!' };
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderId: `FD-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Completed',
      orderStatus: 'Pending',
      estimatedDeliveryTime: '30-40 min',
      ...orderData,
      createdAt: new Date().toISOString()
    };
    const orders = getStoredOrders();
    orders.unshift(newOrder);
    saveStoredOrders(orders);
    return { success: true, data: newOrder };
  },

  async getOrders() {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const orders = getStoredOrders();
    return { success: true, count: orders.length, data: orders };
  },

  async getOrderById(idOrOrderId) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${idOrOrderId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const orders = getStoredOrders();
    const match = orders.find(
      (o) =>
        (o._id || '').toLowerCase() === idOrOrderId.toLowerCase() ||
        (o.orderId || '').toLowerCase() === idOrOrderId.toLowerCase()
    );
    return match ? { success: true, data: match } : { success: false, message: 'Order not found' };
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const orders = getStoredOrders();
    const order = orders.find(
      (o) => (o._id || '').toLowerCase() === id.toLowerCase() || (o.orderId || '').toLowerCase() === id.toLowerCase()
    );
    if (order) {
      order.orderStatus = status;
      if (status === 'Delivered') order.paymentStatus = 'Completed';
      saveStoredOrders(orders);
      return { success: true, data: order };
    }
    return { success: false, message: 'Order not found' };
  },

  async deleteOrder(id) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    let orders = getStoredOrders();
    orders = orders.filter(
      (o) => (o._id || '').toLowerCase() !== id.toLowerCase() && (o.orderId || '').toLowerCase() !== id.toLowerCase()
    );
    saveStoredOrders(orders);
    return { success: true };
  },

  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/orders/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const orders = getStoredOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
    return {
      success: true,
      data: {
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders
      }
    };
  },

  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { status: 'online', database: { state: 'Client Local Engine (Active)' } };
  }
};
