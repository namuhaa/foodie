import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Phone, User, Mail, CreditCard, Banknote, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { cart, subtotal, deliveryFee, tax, discount, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Springfield',
    postalCode: '97477',
    notes: '',
    paymentMethod: 'COD'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMessage('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your street delivery address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          notes: formData.notes.trim()
        },
        items: cart.map((item) => ({
          foodId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        deliveryFee,
        tax,
        totalAmount: totalPrice,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.data) {
        clearCart();
        onClose();
        onOrderPlaced(res.data);
      } else {
        setErrorMessage(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Network error occurred while placing order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl my-8 border border-slate-100">
          
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-brand-50/60">
            <div>
              <h3 className="text-xl font-black text-slate-900">Complete Your Delivery Order</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                We'll rush your fresh food directly to your doorstep!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Details Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                1. Delivery & Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-slate-400 text-[11px]">(for order updates)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Street Address & Apartment / Suite <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    name="address"
                    required
                    rows="2"
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal / Zip Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Special Delivery Instructions <span className="text-slate-400 text-[11px]">(optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Ring doorbell twice, leave with guard..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Select Payment Method
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Banknote className="w-6 h-6 text-brand-600 mb-1" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Pay upon arrival</span>
                </label>

                {/* Credit / Debit Card */}
                <label
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'Card'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={formData.paymentMethod === 'Card'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 text-brand-600 mb-1" />
                  <span className="text-xs font-bold">Credit/Debit Card</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Instant & Secure</span>
                </label>

                {/* UPI / Online */}
                <label
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Smartphone className="w-6 h-6 text-brand-600 mb-1" />
                  <span className="text-xs font-bold">UPI / GPay / PhonePe</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Zero extra fees</span>
                </label>
              </div>
            </div>

            {/* Order Items Recap */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>Items in Order ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>Delivery & Taxes</span>
                <span className="text-slate-900 font-bold">${(deliveryFee + tax).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900">Total Payable</span>
                <span className="text-xl font-black text-brand-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 active:scale-98 disabled:opacity-70 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-brand-600/30 hover:shadow-brand-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order (${totalPrice.toFixed(2)})</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
