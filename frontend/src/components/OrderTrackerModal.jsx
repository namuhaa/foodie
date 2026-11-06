import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, ChefHat, Bike, PackageCheck, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const ORDER_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'Received & verified by restaurant', icon: Clock },
  { key: 'Preparing', label: 'Preparing Food', desc: 'Fresh ingredients being cooked', icon: ChefHat },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier on the way to you', icon: Bike },
  { key: 'Delivered', label: 'Delivered', desc: 'Delivered hot & fresh to you', icon: PackageCheck }
];

export default function OrderTrackerModal({ isOpen, onClose, initialOrderId = '' }) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId, isOpen]);

  const fetchOrder = async (id) => {
    if (!id || !id.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.getOrderById(id.trim());
      if (res.success && res.data) {
        setSearchedOrder(res.data);
      } else {
        setError(res.message || 'Order not found');
        setSearchedOrder(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to find order');
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };

  if (!isOpen) return null;

  const currentStatus = searchedOrder?.orderStatus || 'Pending';
  const getStepIndex = (status) => {
    if (status === 'Cancelled') return -1;
    const idx = ORDER_STEPS.findIndex((s) => s.key.toLowerCase() === status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };
  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-xl my-8 border border-slate-100 p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900">Track Your Food Order</h3>
              <p className="text-xs text-slate-500 font-medium">
                Live real-time status of your meal
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Order ID input */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. FD-10492)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Track</span>}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Details View */}
          {searchedOrder && (
            <div className="mt-6 space-y-6">
              
              {/* Top Banner Card */}
              <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Order ID</span>
                  <div className="text-base font-black text-brand-700">#{searchedOrder.orderId}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong className="text-slate-800">{searchedOrder.customer?.name}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Current Status</span>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        searchedOrder.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchedOrder.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      }`}
                    >
                      {searchedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    ETA: <strong>{searchedOrder.estimatedDeliveryTime || '30-40 min'}</strong>
                  </div>
                </div>
              </div>

              {/* Progress Stepper (Timeline) */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = activeStepIdx >= idx;
                  const isCurrent = activeStepIdx === idx;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Circle Indicator */}
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'bg-white border-slate-300 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-brand-100 animate-pulse' : ''}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`w-4 h-4 ${
                              isDone ? 'text-brand-600' : 'text-slate-400'
                            }`}
                          />
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand-100 text-brand-700 rounded-md">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Items in order */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Order Summary
                </h5>
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {searchedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5 text-xs">
                      <span className="font-semibold text-slate-800">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-black text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-brand-600 font-extrabold text-sm">
                    ${Number(searchedOrder.totalAmount).toFixed(2)} ({searchedOrder.paymentMethod})
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
