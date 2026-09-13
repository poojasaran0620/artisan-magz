import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { Heart, X, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onNavigateHamper: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateHamper,
}) => {
  const { wishlist, toggleWishlist } = useWishlist();

  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FCFAF7] rounded-3xl w-full max-w-lg shadow-2xl border border-roseGold-light overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-white border-b border-roseGold-light/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-blush-600 fill-blush-500" />
            <h3 className="font-serif text-lg font-bold text-wine-900">
              Saved Keepsakes ({wishlist.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-wine-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-roseGold-light/30">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-blush-50 text-blush-400 mx-auto flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-wine-900">No Saved Keepsakes Yet</h4>
              <p className="text-xs text-wine-900/60 max-w-xs mx-auto">
                Tap the little heart icon on any personalized magazine, frame, or hamper to save it here for later!
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover border shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-serif text-xs font-bold text-wine-900 truncate">
                      {p.title}
                    </h5>
                    <p className="font-sans text-[11px] text-blush-700 font-semibold tabular-nums mt-0.5">
                      {formatPrice(p.basePrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      if (p.category === 'hamper') onNavigateHamper();
                      else onSelectProduct(p.id);
                    }}
                    className="px-3 py-1.5 bg-wine-900 text-white rounded-xl text-xs font-medium hover:bg-wine-800 transition flex items-center gap-1"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-1.5 text-wine-900/40 hover:text-red-600 transition"
                    title="Remove from saved"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
