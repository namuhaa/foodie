import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  RefreshCw,
  Search,
  Database,
  Layers,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['Burger', 'Pizza', 'Biryani', 'Snacks', 'Desserts', 'Drinks'];
const STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminModal({ isOpen, onClose, onFoodsUpdated }) {
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('foods'); // 'foods' | 'orders' | 'status'
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');

  // Add / Edit Food Item Modal State
  const [isEditingFood, setIsEditingFood] = useState(false);
  const [foodForm, setFoodForm] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    category: 'Burger',
    image: '',
    prepTime: '15-20 min',
    rating: 4.8,
    isVeg: false,
    inStock: true,
    isFeatured: false
  });

  useEffect(() => {
    if (isOpen) {
      loadAllAdminData();
    }
  }, [isOpen]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [foodsRes, ordersRes, statsRes, healthRes] = await Promise.all([
        api.getFoods(),
        api.getOrders(),
        api.getStats().catch(() => ({ success: false })),
        api.checkHealth().catch(() => ({ database: { state: 'Online' } }))
      ]);

      if (foodsRes.success) setFoods(foodsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (healthRes.database) setDbStatus(healthRes.database);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showToast('Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddFood = () => {
    setFoodForm({
      _id: '',
      name: '',
      description: '',
      price: '',
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      prepTime: '20-25 min',
      rating: 4.8,
      isVeg: false,
      inStock: true,
      isFeatured: false
    });
    setIsEditingFood(true);
  };

  const handleOpenEditFood = (food) => {
    setFoodForm({
      _id: food._id || food.id,
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      prepTime: food.prepTime || '20-25 min',
      rating: food.rating || 4.8,
      isVeg: Boolean(food.isVeg),
      inStock: Boolean(food.inStock),
      isFeatured: Boolean(food.isFeatured)
    });
    setIsEditingFood(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.description || !foodForm.image) {
      showToast('Please fill all required food fields', 'error');
      return;
    }

    try {
      if (foodForm._id) {
        // Update
        const res = await api.updateFood(foodForm._id, foodForm);
        if (res.success) {
          showToast(`Updated "${foodForm.name}" successfully!`);
          setIsEditingFood(false);
          loadAllAdminData();
          if (onFoodsUpdated) onFoodsUpdated();
        }
      } else {
        // Create
        const res = await api.createFood(foodForm);
        if (res.success) {
          showToast(`Added "${foodForm.name}" to menu!`);
          setIsEditingFood(false);
          loadAllAdminData();
          if (onFoodsUpdated) onFoodsUpdated();
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to save food item', 'error');
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;
    try {
      const res = await api.deleteFood(id);
      if (res.success) {
        showToast(`Deleted "${name}"`, 'info');
        loadAllAdminData();
        if (onFoodsUpdated) onFoodsUpdated();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete food', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order #${orderId} marked as "${newStatus}"!`);
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    try {
      const res = await api.deleteOrder(orderId);
      if (res.success) {
        showToast(`Order #${orderId} deleted`, 'info');
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete order', 'error');
    }
  };

  const handleReseedFoods = async () => {
    if (!window.confirm('Reset all foods to default 24 sample dishes?')) return;
    try {
      const res = await api.reseedFoods();
      if (res.success) {
        showToast(res.message || 'Menu successfully restored!');
        loadAllAdminData();
        if (onFoodsUpdated) onFoodsUpdated();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reset menu', 'error');
    }
  };

  if (!isOpen) return null;

  const filteredFoods = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-6xl my-6 border border-slate-100 flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Foodie <span className="text-brand-600">Admin Control Center</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage live food catalog, track customer orders, and check database status
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadAllAdminData}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-white rounded-xl border border-slate-200 transition-colors"
                title="Refresh Admin Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-4 sm:px-6 bg-brand-50/30 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 rounded-2xl border border-brand-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">Total Orders</span>
                <p className="text-lg font-black text-slate-900">{orders.length}</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-brand-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">Total Revenue</span>
                <p className="text-lg font-black text-slate-900">${stats.totalRevenue || 0}</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-brand-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">Pending Orders</span>
                <p className="text-lg font-black text-slate-900">{stats.pendingOrders || 0}</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-brand-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">Dishes in Menu</span>
                <p className="text-lg font-black text-slate-900">{foods.length}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-6 gap-2 bg-white pt-2">
            <button
              onClick={() => setActiveTab('foods')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'foods'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manage Food Items ({foods.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database & System</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            
            {/* TAB 1: FOOD ITEMS MANAGEMENT */}
            {activeTab === 'foods' && (
              <div className="space-y-4">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleReseedFoods}
                      className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Reset Default Menu
                    </button>
                    <button
                      onClick={handleOpenAddFood}
                      className="flex-1 sm:flex-none px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-600/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish</span>
                    </button>
                  </div>
                </div>

                {/* Foods Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Dish</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Rating</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredFoods.map((food) => (
                          <tr key={food._id || food.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={food.image}
                                  alt={food.name}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate max-w-xs">{food.name}</div>
                                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{food.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                                {food.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900">
                              ${Number(food.price).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 font-bold text-amber-600">
                              ⭐ {food.rating || 4.8}
                            </td>
                            <td className="py-3 px-4">
                              {food.inStock ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of Stock
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditFood(food)}
                                  className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                  title="Edit Dish"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFood(food._id || food.id, food.name)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Dish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer Details</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status & Update</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No orders placed yet. Place an order from the cart to view it here!
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id || order.orderId} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-black text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                                  #{order.orderId}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{order.customer?.name}</div>
                                <div className="text-[11px] text-slate-500">{order.customer?.phone}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                  {order.customer?.address}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="text-xs text-slate-700">
                                  {order.items?.map((it, idx) => (
                                    <div key={idx} className="truncate max-w-[160px]">
                                      {it.quantity}x {it.name}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td className="py-3 px-4 font-black text-slate-900">
                                ${Number(order.totalAmount).toFixed(2)}
                              </td>

                              <td className="py-3 px-4">
                                <span className="text-xs font-bold text-slate-700 block">
                                  {order.paymentMethod}
                                </span>
                                <span
                                  className={`text-[10px] font-bold ${
                                    order.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                                  }`}
                                >
                                  {order.paymentStatus}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order._id || order.orderId, e.target.value)
                                  }
                                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                                    order.orderStatus === 'Delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : order.orderStatus === 'Cancelled'
                                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                                      : 'bg-brand-50 text-brand-800 border-brand-300'
                                  }`}
                                >
                                  {STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteOrder(order._id || order.orderId)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DATABASE & SYSTEM STATUS */}
            {activeTab === 'status' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">MongoDB Connection Details</h4>
                      <p className="text-xs text-slate-500">MERN Stack Database Configuration</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-500">Active Storage Engine:</span>
                      <span className="font-black text-brand-600 bg-white px-3 py-1 rounded-lg border border-brand-200">
                        {dbStatus?.state || 'Active Storage'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-500">MongoDB URI:</span>
                      <code className="font-mono text-xs text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                        {dbStatus?.uri || 'mongodb://127.0.0.1:27017/foodie_db'}
                      </code>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-500">Node & Express API:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> http://localhost:5000
                      </span>
                    </div>

                    <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs text-brand-900 leading-relaxed">
                      💡 <strong>Seamless Dual-Mode Persistence:</strong> Foodie seamlessly connects to your local or cloud MongoDB via Mongoose. If MongoDB is currently stopped, our internal high-performance fallback store enables 100% of website features (ordering, admin adding/editing/deleting dishes, order status tracking) without any disruptions!
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* EDIT / ADD FOOD MODAL OVERLAY */}
          {isEditingFood && (
            <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-lg font-black text-slate-900">
                    {foodForm._id ? 'Edit Food Item' : 'Add New Food Item'}
                  </h4>
                  <button
                    onClick={() => setIsEditingFood(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveFood} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Truffle Mushroom Burger"
                      value={foodForm.name}
                      onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={foodForm.category}
                        onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="9.99"
                        value={foodForm.price}
                        onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={foodForm.image}
                      onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="Fresh ingredients, toppings and flavors..."
                      value={foodForm.description}
                      onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time</label>
                      <input
                        type="text"
                        placeholder="20-25 min"
                        value={foodForm.prepTime}
                        onChange={(e) => setFoodForm({ ...foodForm, prepTime: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={foodForm.rating}
                        onChange={(e) => setFoodForm({ ...foodForm, rating: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={foodForm.isVeg}
                        onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.checked })}
                        className="w-4 h-4 text-brand-600 rounded"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={foodForm.inStock}
                        onChange={(e) => setFoodForm({ ...foodForm, inStock: e.target.checked })}
                        className="w-4 h-4 text-brand-600 rounded"
                      />
                      <span>In Stock</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingFood(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Save Dish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
