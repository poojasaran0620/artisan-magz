import React, { useState } from 'react';
import { Star, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';

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

  const categories = [
    { id: 'all', label: 'All Keepsakes' },
    { id: 'magazine', label: 'Magazines' },
    { id: 'mini-magazine', label: 'Mini Magazines' },
    { id: 'frame', label: 'Photo Frames' },
    { id: 'newspaper', label: 'Newspaper Cards' },
    { id: 'songbook', label: 'Song Plaques' },
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
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-roseGold">
            Handmade With Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Trending Personalized Gifts
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70">
            Select an item below to enter your custom headlines, upload your photos, and preview your gift in real time.
          </p>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`text-xs px-4 py-2 rounded-full transition duration-200 cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-charcoal text-[#FDFCF5] font-semibold shadow-sm'
                    : 'bg-cream-100 text-charcoal/80 hover:bg-blush-100/70 border border-taupe-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isLiked = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-taupe-200/80 shadow-soft hover:shadow-luxury transition duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div
                  onClick={() => handleProductClick(product)}
                  className="relative aspect-square overflow-hidden bg-cream-100 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />

                  {/* Top Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-charcoal text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                      isLiked
                        ? 'bg-roseGold text-white shadow-sm'
                        : 'bg-white/80 text-charcoal hover:bg-white'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-charcoal'}`}
                    />
                  </button>

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <span className="w-full py-2 bg-white/95 backdrop-blur-md rounded-xl text-xs font-semibold text-charcoal text-center shadow">
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
                        <span className="text-lg font-bold text-charcoal">
                          {formatPrice(product.basePrice)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-charcoal/40 line-through">
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

                    <button
                      onClick={() => handleProductClick(product)}
                      className="px-4 py-2 bg-cream-100 hover:bg-blush-100 text-charcoal border border-taupe-200/70 rounded-full text-xs font-semibold flex items-center gap-1 group-hover:bg-charcoal group-hover:text-[#FDFCF5] group-hover:border-charcoal transition duration-200 cursor-pointer"
                    >
                      <span>Personalize</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
