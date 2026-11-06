import React from 'react';
import { Plus, Minus, Star, Clock, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food._id || food.id);

  const handleAdd = () => {
    addToCart(food);
  };

  const handleIncrement = () => {
    updateQuantity(food._id || food.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(food._id || food.id, quantity - 1);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-brand-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col h-full">
      {/* Food Image Container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          <div
            className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${
              food.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
            title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm text-[11px] font-bold text-slate-700">
          {food.category}
        </div>

        {/* Out of Stock Overlay */}
        {!food.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          {/* Rating and Prep Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
            <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{food.rating ? food.rating.toFixed(1) : '4.8'}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{food.prepTime || '20-25 min'}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {food.name}
          </h4>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Bottom Row: Price and Add To Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              ${Number(food.price).toFixed(2)}
            </span>
          </div>

          {/* Action Button */}
          {food.inStock ? (
            quantity > 0 ? (
              /* Already in cart: Quantity controller */
              <div className="flex items-center bg-brand-50 border border-brand-200 rounded-xl p-1 gap-2 shadow-sm">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-brand-700 hover:bg-brand-600 hover:text-white transition-colors shadow-xs active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-brand-900 min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Not yet in cart */
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </button>
            )
          ) : (
            <button
              disabled
              className="px-3.5 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
