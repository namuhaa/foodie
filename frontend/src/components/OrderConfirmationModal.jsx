import React from 'react';
import { CheckCircle2, Clock, MapPin, Package, ArrowRight, X, Phone } from 'lucide-react';

export default function OrderConfirmationModal({ order, isOpen, onClose, onTrackOrder }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-lg my-8 border border-slate-100 p-6 sm:p-8">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Checkmark Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black uppercase tracking-wider">
                Order Placed Successfully!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2">
                Thank You, {order.customer?.name}!
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Your delicious food is now being prepared fresh in our kitchen.
              </p>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="mt-6 p-4 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-brand-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Order ID</span>
              <span className="text-sm font-black text-brand-700 bg-white px-3 py-1 rounded-lg border border-brand-200 shadow-xs">
                #{order.orderId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Estimated Arrival</span>
                <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  {order.estimatedDeliveryTime || '30-40 min'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Mode</span>
                <span className="font-extrabold text-slate-800 mt-0.5">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-2 border-t border-brand-100 text-xs flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Deliver to:</span>
                <span className="text-slate-600">{order.customer?.address}, {order.customer?.city}</span>
              </div>
            </div>
          </div>

          {/* Items summary */}
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ordered Items ({order.items?.length || 0})
            </h5>
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[10px]">
                    {item.quantity}x
                  </span>
                  <span className="font-bold text-slate-800">{item.name}</span>
                </div>
                <span className="font-black text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total Paid */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700">Total Amount</span>
            <span className="text-2xl font-black text-brand-600">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderId);
              }}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 flex items-center justify-center gap-2 transition-all"
            >
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 transition-colors"
            >
              Order More Food
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
