import React, { useState, useEffect } from 'react';
import { ShoppingBag, UtensilsCrossed, ShieldAlert, Compass, Search, Menu, X, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart, onOpenAdmin, onOpenTracker, onSearchFocus }) {
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-100 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Food<span className="text-brand-600">ie</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 rounded-full border border-brand-200">
                Express
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Why Foodie
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Reviews
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Quick Track Order */}
            <button
              onClick={onOpenTracker}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200/80 transition-all hover:shadow-sm"
              title="Track your order status"
            >
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>Track Order</span>
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-brand-700 bg-slate-100 hover:bg-brand-50 rounded-xl border border-slate-200 hover:border-brand-200 transition-all"
              title="Open Admin Portal to manage foods & orders"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/30 hover:shadow-lg hover:shadow-brand-600/40 transition-all"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-black bg-white text-brand-700 rounded-full shadow-inner animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 pb-2 animate-fadeIn">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
            >
              Food Menu
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
            >
              Food Categories
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
            >
              Why Foodie
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
            >
              Customer Reviews
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-700 bg-brand-50 rounded-lg"
            >
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Track Live Order</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
