import React from 'react';
import { UtensilsCrossed, Phone, Mail, MapPin, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ onCategoryClick, onOpenAdmin, onOpenTracker }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Food<span className="text-brand-400">ie</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your favorite local and gourmet delicacies delivered fresh, warm, and fast. Built on the modern MERN stack.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>100 Gourmet Plaza, Food District, Springfield</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (800) 555-FOOD (3663)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@foodie.com</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {['Burger', 'Pizza', 'Biryani', 'Snacks', 'Desserts', 'Drinks'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onCategoryClick(cat);
                      const el = document.getElementById('menu');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-brand-400 transition-colors font-semibold text-brand-400"
                >
                  Track Live Order ⚡
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-brand-400 transition-colors"
                >
                  Admin Management Portal
                </button>
              </li>
              <li>
                <a href="#hero" className="hover:text-brand-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-400 transition-colors">
                  Delivery Guarantees
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-brand-400 transition-colors">
                  Customer Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Operating */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Delivery Hours
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="text-slate-300 font-bold block">Monday - Friday:</span>
                <span>08:00 AM - 11:30 PM</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-300 font-bold block">Saturday - Sunday:</span>
                <span>09:00 AM - 01:00 AM</span>
              </div>
              <div className="pt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Kitchen Open Now
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Foodie Inc. All rights reserved. MERN Stack Application.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
