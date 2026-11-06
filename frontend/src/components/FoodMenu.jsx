import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X, RefreshCw } from 'lucide-react';
import FoodCard from './FoodCard';
import CategoryFilter from './CategoryFilter';

export default function FoodMenu({
  foods = [],
  loading = false,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  searchQuery,
  onSearchChange,
  onRefresh
}) {
  const [sortBy, setSortBy] = useState('recommended');
  const [vegOnly, setVegOnly] = useState(false);

  // Filter & Sort foods
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // Filter veg
    if (vegOnly) {
      result = result.filter((item) => item.isVeg);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Recommended: featured first
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [foods, vegOnly, sortBy]);

  return (
    <section id="menu" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Handcrafted With Passion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Delicious <span className="text-brand-600">Menu</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Choose from freshly prepared burgers, sizzling pizzas, fragrant biryanis, snacks, desserts, and drinks.
          </p>
        </div>

        {/* Category Pills Component */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          categoryCounts={categoryCounts}
        />

        {/* Search, Filter & Sort Controls Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Burger, Biryani, Truffle)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters and Sorters */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
            {/* Vegetarian Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold select-none hover:border-brand-300 transition-colors">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Pure Veg
              </span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors"
                title="Refresh Menu"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Food Items Grid */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="h-48 bg-slate-200 rounded-2xl w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-6 bg-slate-200 rounded w-16" />
                  <div className="h-9 bg-slate-200 rounded-xl w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFoods.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id || food.id} food={food} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Food Items Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
              We couldn't find any dishes matching your current search or category filter. Try clearing filters.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All');
                setVegOnly(false);
              }}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
