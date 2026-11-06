import React from 'react';
import { Zap, HeartHandshake, ShieldCheck, Sparkles, Award, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Hot meals delivered to your doorstep within 30 minutes, kept warm in insulated thermal bags.'
  },
  {
    icon: Award,
    title: 'Master Chef Recipes',
    description: 'Every single dish is curated and seasoned to perfection by seasoned top restaurant culinary chefs.'
  },
  {
    icon: ShieldCheck,
    title: '100% Fresh & Hygienic',
    description: 'Zero stale ingredients, strict temperature logs, and certified clean kitchen standards at every step.'
  },
  {
    icon: Headphones,
    title: '24/7 Priority Support',
    description: 'Our customer support team is always available to assist with order tracking, requests, or questions.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The <span className="text-brand-600">Foodie</span> Difference
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            We don't just deliver food; we deliver a complete fine-dining feast experience to your home.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-brand-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
