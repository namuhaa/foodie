import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Emily Watson',
    role: 'Food Blogger',
    comment: 'The Hyderabadi Biryani is unbelievably fragrant and authentic! Arrived piping hot in under 25 minutes. Foodie is easily my #1 delivery app.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    dish: 'Ordered: Hyderabadi Chicken Biryani'
  },
  {
    name: 'David Chen',
    role: 'Tech Lead',
    comment: 'Best burgers in town! The brioche buns are so soft, and the molten lava cake is pure heaven. The live tracking feature is super accurate.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    dish: 'Ordered: Classic Cheeseburger & Lava Cake'
  },
  {
    name: 'Sophia Patel',
    role: 'Product Designer',
    comment: 'Clean UI, effortless ordering, and incredible packaging. I ordered for our entire team lunch and everyone was blown away by the quality!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    dish: 'Ordered: Margherita Pizza & Truffle Fries'
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Loved by 15,000+ Foodies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What Our <span className="text-brand-600">Customers Say</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Read real stories and experiences from food lovers in your city.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/80 hover:border-brand-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="mt-4 inline-block px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-brand-600">
                  {review.dish}
                </div>
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/60">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
