const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Foods
  async getFoods(category = '', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim() !== '') params.append('search', search.trim());
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}/foods${query}`);
    return handleResponse(res);
  },

  async getFoodById(id) {
    const res = await fetch(`${BASE_URL}/foods/${id}`);
    return handleResponse(res);
  },

  async createFood(foodData) {
    const res = await fetch(`${BASE_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData)
    });
    return handleResponse(res);
  },

  async updateFood(id, foodData) {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData)
    });
    return handleResponse(res);
  },

  async deleteFood(id) {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${BASE_URL}/foods/categories`);
    return handleResponse(res);
  },

  async reseedFoods() {
    const res = await fetch(`${BASE_URL}/foods/reseed`, {
      method: 'POST'
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  async getOrders() {
    const res = await fetch(`${BASE_URL}/orders`);
    return handleResponse(res);
  },

  async getOrderById(idOrOrderId) {
    const res = await fetch(`${BASE_URL}/orders/${idOrOrderId}`);
    return handleResponse(res);
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: status })
    });
    return handleResponse(res);
  },

  async deleteOrder(id) {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/orders/stats`);
    return handleResponse(res);
  },

  // Health
  async checkHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  }
};
