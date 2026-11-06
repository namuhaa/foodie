import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onProceedToCheckout }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brand-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Delicious Cart</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {cart.length === 0 ? 'Your cart is empty' : `${cart.length} unique items selected`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center text-4xl mb-4 border border-brand-100">
                🛒
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Your Cart is Empty</h4>
              <p className="text-sm text-slate-500 max-w-xs mt-1 mb-6">
                Explore our mouth-watering burgers, pizzas, biryanis, and treats to get started!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end pb-1">
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Items</span>
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-brand-200 transition-colors"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-xs text-brand-600 font-semibold mt-0.5">
                        ${Number(item.price).toFixed(2)} each
                      </div>
                      <div className="text-xs font-black text-slate-900 mt-1">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold min-w-[16px] text-center text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove Trash Button */}
                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Promo Code Accordion */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. FOODIE20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Active Coupon Pill */}
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Code <strong className="font-bold">{appliedCoupon}</strong> active!
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-900 text-xs underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="mt-1 text-[11px] text-slate-400">
                    💡 Tip: Use code <span className="font-bold text-brand-600">FOODIE20</span> for 20% off or <span className="font-bold text-brand-600">WELCOME5</span> for $5 off!
                  </div>
                </div>
              </div>

              {/* Order Summary & Checkout Footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Delivery Fee
                      {subtotal >= 25 && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                          Free Over $25
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-slate-900">
                      {deliveryFee === 0 ? <span className="text-emerald-600 font-black">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-brand-600 text-xl font-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
