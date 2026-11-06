import React from 'react';
import { ArrowRight, Flame, ShieldCheck, Clock, Star, Sparkles, ChefHat } from 'lucide-react';

export default function Hero({ onOrderNow, onExploreCategories }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/30 to-blue-300/20 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-brand-700 text-xs sm:text-sm font-bold tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Fastest Food Delivery in Your Neighborhood</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Delicious Food,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">
                Delivered Fresh!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Craving authentic biryanis, gourmet burgers, wood-fired pizzas, or refreshing desserts? 
              Foodie brings restaurant-quality feasts straight to your doorstep with guaranteed freshness.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Order Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCategories}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 font-bold text-base rounded-2xl border border-slate-200 hover:border-brand-200 shadow-sm transition-all"
              >
                Browse Menu
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">30 Mins</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">Express Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Star className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">4.9 / 5.0</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">15k+ Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Fresh</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">Hygienic Kitchens</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Food Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Main Featured Food Card */}
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious Classic Burger"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                      Chef's Choice
                    </span>
                    <span className="flex items-center text-xs font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300 inline mr-1" /> 4.9 (2.4k orders)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">Classic Brioche Gourmet Burger</h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1">
                    Double Angus patty, sharp aged cheddar, and house relish
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <span className="text-2xl font-black text-brand-300">$8.99</span>
                    <button
                      onClick={onOrderNow}
                      className="px-4 py-1.5 text-xs font-bold bg-white text-brand-700 hover:bg-brand-50 rounded-xl transition-colors shadow"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Free Delivery */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-brand-100 flex items-center gap-3 animate-bounce-subtle">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                  🎉
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Free Delivery</p>
                  <p className="text-[11px] text-brand-600 font-semibold">On orders over $25</p>
                </div>
              </div>

              {/* Floating Badge 2: Delivery Timer */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-brand-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Fast 30 Min Arrival</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Live GPS tracking</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
