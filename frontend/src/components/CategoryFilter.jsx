import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All Dishes', emoji: '🍽️' },
  { id: 'Burger', label: 'Burger', emoji: '🍔' },
  { id: 'Pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'Biryani', label: 'Biryani', emoji: '🍚' },
  { id: 'Snacks', label: 'Snacks', emoji: '🍟' },
  { id: 'Desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'Drinks', label: 'Drinks', emoji: '🥤' }
];

export default function CategoryFilter({ selectedCategory, onSelectCategory, categoryCounts = {} }) {
  return (
    <div id="categories" className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Explore Categories</h3>
          <p className="text-xs sm:text-sm text-slate-500">Pick from our mouth-watering collections</p>
        </div>
      </div>

      {/* Horizontal Scrollable Category Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          const count = cat.id === 'All' 
            ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
            : (categoryCounts[cat.id] || 0);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-600 shadow-sm'
              }`}
            >
              <span className="text-lg leading-none">{cat.emoji}</span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
