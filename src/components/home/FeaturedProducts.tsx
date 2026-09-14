import React, { useState } from 'react';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { springs, luxuryEase } from '../../styles/motion';

interface FeaturedProductsProps {
  onSelectProduct: (productId: string) => void;
  onHamperClick: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onSelectProduct,
  onHamperClick,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const categories = [
    { id: 'all', label: 'All Keepsakes' },
    { id: 'magazine', label: 'Magazines' },
    { id: 'mini-magazine', label: 'Mini Magazines' },
    { id: 'frame', label: 'Photo Frames' },
    { id: 'newspaper', label: 'Newspaper Cards' },
    { id: 'songbook', label: 'Songs Book' },
    { id: 'hamper', label: 'Custom Hampers' },
  ];

  const filteredProducts =
    activeTab === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeTab);

  const handleProductClick = (product: Product) => {
    if (product.category === 'hamper') {
      onHamperClick();
    } else {
      onSelectProduct(product.id);
    }
  };

  return (
    <section className="py-16 bg-[#FDFCF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: luxuryEase }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-3"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-roseGold">
            Handmade With Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Trending Personalized Gifts
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70">
            Select an item below to enter your custom headlines, upload your photos, and preview your gift in real time.
          </p>

          {/* Category Tabs with Animated Sliding Pill Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-4 flex-wrap bg-cream-100/60 p-1.5 rounded-full max-w-fit mx-auto border border-taupe-200/60">
            {categories.map((cat) => {
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="relative text-xs px-3.5 py-1.5 rounded-full transition-colors duration-200 cursor-pointer select-none"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFeaturedCategoryPill"
                      transition={springs.snappy}
                      className="absolute inset-0 bg-charcoal rounded-full shadow-sm"
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isSelected ? 'text-[#FDFCF5] font-semibold' : 'text-charcoal/80 hover:text-charcoal'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid with Layout Transition */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const isLiked = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.93, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 10, transition: { duration: 0.2 } }}
                  transition={springs.smooth}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-taupe-200/80 shadow-soft hover:shadow-luxury transition-shadow duration-300 flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="relative aspect-square overflow-hidden bg-cream-100 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                    />

                    {/* Top Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-charcoal text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button with Spring Tap */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      transition={springs.snappy}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                        showToast(
                          isLiked ? 'Removed from Keepsakes' : 'Saved to Wishlist ❤️',
                          'wishlist'
                        );
                      }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-roseGold text-white shadow-sm'
                          : 'bg-white/80 text-charcoal hover:bg-white'
                      }`}
                      aria-label="Wishlist"
                    >
                      <motion.div
                        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                        transition={springs.bouncy}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isLiked ? 'fill-white text-white' : 'text-charcoal'
                          }`}
                        />
                      </motion.div>
                    </motion.button>

                    {/* Hover Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                      <span className="w-full py-2 bg-white/95 backdrop-blur-md rounded-xl text-xs font-semibold text-charcoal text-center shadow transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        Tap to Customize & Preview
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating & reviews */}
                      <div className="flex items-center gap-1.5 text-xs text-roseGold mb-1.5">
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 fill-roseGold text-roseGold" />
                          <span className="font-bold text-charcoal ml-1">{product.rating}</span>
                        </div>
                        <span className="text-charcoal/40">•</span>
                        <span className="text-charcoal/60 text-[11px]">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      <h3
                        onClick={() => handleProductClick(product)}
                        className="font-serif text-lg text-charcoal font-medium group-hover:text-roseGold transition cursor-pointer leading-snug"
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-charcoal/65 line-clamp-2 mt-1">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-taupe-200/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans text-lg font-bold text-charcoal tabular-nums">
                            {formatPrice(product.basePrice)}
                          </span>
                          {product.originalPrice && (
                            <span className="font-sans text-xs text-charcoal/40 line-through tabular-nums">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-roseGold font-medium">
                          {product.variants.length > 1
                            ? `${product.variants.length} custom options`
                            : '100% bespoke'}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.snappy}
                        onClick={() => handleProductClick(product)}
                        className="px-4 py-2 bg-cream-100 hover:bg-blush-100 text-charcoal border border-taupe-200/70 rounded-full text-xs font-semibold flex items-center gap-1 group-hover:bg-charcoal group-hover:text-[#FDFCF5] group-hover:border-charcoal transition-colors duration-200 cursor-pointer"
                      >
                        <span>Personalize</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
