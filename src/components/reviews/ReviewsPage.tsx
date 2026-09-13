import React from 'react';
import { REVIEWS } from '../../data/products';
import { Star, CheckCircle, Heart, ArrowLeft } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';

interface ReviewsPageProps {
  onBackToShop: () => void;
  onSelectProduct: (productId: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onBackToShop, onSelectProduct }) => {
  return (
    <div className="bg-[#FDFCF5] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-taupe-200/60 space-y-3">
          <button
            onClick={onBackToShop}
            className="text-xs text-charcoal/70 hover:text-charcoal flex items-center gap-1 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-roseGold uppercase tracking-widest bg-blush-100/50 px-3.5 py-1 rounded-full border border-roseGold/20">
            <Heart className="w-3.5 h-3.5 fill-roseGold text-roseGold" />
            <span>Community Love Notes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Real Unboxings & Celebrations 💌
          </h1>
          <p className="text-xs sm:text-sm text-taupe-700 max-w-xl">
            See candid customer photos, heartfelt reactions, and anniversary milestones captured by couples across India.
          </p>
        </div>

        {/* Rating Overview Banner */}
        <div className="my-8 p-6 bg-white rounded-3xl border border-taupe-200/80 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cream-100 border border-taupe-200/60 flex flex-col items-center justify-center text-charcoal font-serif">
              <span className="text-2xl font-bold">4.95</span>
              <span className="text-[10px] text-roseGold font-sans font-bold">OUT OF 5</span>
            </div>
            <div>
              <div className="flex items-center text-roseGold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-roseGold text-roseGold" />
                ))}
              </div>
              <p className="text-xs font-bold text-charcoal mt-1">Based on 2,500+ Verified Customer Gifts</p>
              <p className="text-[11px] text-taupe-600">98.4% of recipients say this made their milestone unforgettable</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/artisan.magz?stkn=bXVmN2RsanZlMGdp"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full text-xs font-semibold shadow-luxury flex items-center gap-1.5 transition cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 text-roseGold-light" />
              <span>Tag us @artisan.magz</span>
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 border border-taupe-200/80 shadow-luxury hover:shadow-soft-lg transition duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {rev.image && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100/70 relative group">
                    <img
                      src={rev.image}
                      alt={rev.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-2 right-2 bg-charcoal/80 text-[#FDFCF5] text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      Customer Photo
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-roseGold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-roseGold text-roseGold" />
                  ))}
                </div>

                <p className="text-xs text-charcoal/90 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-taupe-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal flex items-center gap-1">
                      <span>{rev.author}</span>
                      <CheckCircle className="w-3 h-3 text-sage fill-sage/20" />
                    </h4>
                    <p className="text-[10px] text-taupe-600">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-taupe-500">{rev.date}</span>
                </div>
                <p className="text-[10px] text-roseGold font-medium truncate mt-1">
                  Ordered: {rev.productTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
