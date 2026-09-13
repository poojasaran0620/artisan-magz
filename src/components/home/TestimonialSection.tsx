import React from 'react';
import { Star, CheckCircle, Heart, Quote } from 'lucide-react';
import { REVIEWS } from '../../data/products';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FDFCF5] border-t border-taupe-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-roseGold uppercase tracking-widest bg-blush-100/50 px-3.5 py-1 rounded-full border border-roseGold/20">
            <Heart className="w-3.5 h-3.5 fill-roseGold text-roseGold" />
            <span>Over 2,500+ Happy Unboxings</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Loved By Couples & Milestone Celebrators
          </h2>
          <p className="text-xs sm:text-sm text-taupe-700">
            Real photos and genuine reactions shared by our Instagram family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-5 border border-taupe-200/80 shadow-luxury hover:shadow-soft-lg transition duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Review Photo if available */}
                {review.image && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100/70 relative group">
                    <img
                      src={review.image}
                      alt={review.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-2 right-2 bg-charcoal/80 text-[#FDFCF5] text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      Customer Photo
                    </span>
                  </div>
                )}

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-roseGold">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-roseGold text-roseGold" />
                  ))}
                </div>

                <p className="font-serif italic text-xs text-charcoal/90 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-taupe-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal flex items-center gap-1">
                      <span>{review.author}</span>
                      <CheckCircle className="w-3 h-3 text-sage fill-sage/20" />
                    </h4>
                    <p className="text-[10px] text-taupe-600">{review.location}</p>
                  </div>
                  <span className="text-[10px] text-taupe-500">{review.date}</span>
                </div>
                <p className="text-[10px] text-roseGold font-medium truncate mt-1">
                  Ordered: {review.productTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
