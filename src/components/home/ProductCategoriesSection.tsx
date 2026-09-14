import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Hammer, BookOpen } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { springs, luxuryEase } from '../../styles/motion';

interface ProductCategoriesSectionProps {
  onSelectProduct: (productId: string, templateId?: string, variantId?: string) => void;
  onHamperClick: () => void;
}

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  onSelectProduct,
  onHamperClick,
}) => {
  // Referenced Products
  const magazineProduct = PRODUCTS.find((p) => p.id === 'prod-mag-01') || PRODUCTS[0];
  const miniMagazineProduct = PRODUCTS.find((p) => p.id === 'prod-mini-mag-01');
  const frameProduct = PRODUCTS.find((p) => p.id === 'prod-frame-01') || PRODUCTS[1];
  const songProduct = PRODUCTS.find((p) => p.id === 'prod-song-01');
  const newspaperProduct = PRODUCTS.find((p) => p.id === 'prod-news-01');

  // "More Products" collection
  const moreProducts = [
    {
      id: 'mini-magazine',
      title: 'Mini Magazines',
      image: '/products/mini_magazine.jpg',
      alt: 'Personalized Mini Pocket Magazine',
      onClick: () => miniMagazineProduct && onSelectProduct(miniMagazineProduct.id),
      position: 'object-center',
    },
    {
      id: 'frames',
      title: 'Photo Frames',
      image: '/products/playing_cards_frame.jpg',
      alt: 'Personalized Photo Frames',
      onClick: () => onSelectProduct('frames'),
      position: 'object-center',
    },
    {
      id: 'hampers',
      title: 'Gift Hampers',
      image: '/products/gift_hamper_curated_box.jpg',
      alt: 'Curated Gift Hampers',
      onClick: onHamperClick,
      position: 'object-center',
    },
    {
      id: 'song-album',
      title: 'Songs Book',
      image: songProduct?.images[0] || '/products/song_book_cover.jpg',
      alt: 'Songs Book Multi-Page Layout',
      onClick: () => songProduct && onSelectProduct(songProduct.id),
      position: 'object-center',
    },
    {
      id: 'newspaper',
      title: 'Newspaper Card',
      image: '/products/media_1788608467346.jpg',
      alt: 'Vintage Newspaper Frame',
      onClick: () => newspaperProduct && onSelectProduct(newspaperProduct.id),
      position: 'object-top',
    },
  ];

  return (
    <section id="best-selling" className="py-8 sm:py-12 bg-[#FDFCF5] scroll-mt-20">
      {/* ========================================================================= */}
      {/* PART 1: HIGHLIGHTED "BEST SELLING" BANNER                                */}
      {/* Rich gradient matching brand: Taupe (#A69480) to Rose Gold (#B76E79)    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-white py-10 sm:py-14 px-4 sm:px-8 shadow-luxury border border-white/20">
          {/* Subtle Ambient Glow and Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-40" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            {/* Header: Script Cursive "Best Selling" */}
            <div className="text-center space-y-1.5">
              <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#FDFCF5] font-normal tracking-wide drop-shadow-xs">
                Best Selling
              </h2>
              <p className="text-xs sm:text-sm text-[#FDFCF5]/85 max-w-md mx-auto">
                Handcrafted treasures voted customer favorites across India.
              </p>
            </div>

            {/* Spotlight Single Bestseller Card: Custom Magazine */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={springs.smooth}
                className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 text-charcoal shadow-luxury border border-white/80 flex flex-col items-center text-center gap-3.5 relative overflow-hidden group cursor-pointer"
              >
                {/* Bestseller Crown Tag */}
                <div className="absolute top-3 right-3 z-10 bg-charcoal text-[#FDFCF5] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <span>#1 Bestseller 🔥</span>
                </div>

                {/* Magazine Visual - Clickable to go forward */}
                <div
                  onClick={() => onSelectProduct(magazineProduct.id)}
                  className="w-44 sm:w-48 shrink-0 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 shadow-sm border border-taupe-200/50">
                    <img
                      src={magazineProduct.images[0]}
                      alt="Magazines"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                {/* Title & Downside Build Option */}
                <div className="w-full space-y-2.5">
                  <h3
                    onClick={() => onSelectProduct(magazineProduct.id)}
                    className="font-serif text-xl sm:text-2xl font-bold text-charcoal hover:text-roseGold transition-colors cursor-pointer"
                  >
                    Magazines
                  </h3>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={springs.snappy}
                    onClick={() => onSelectProduct(magazineProduct.id)}
                    className="w-full py-2.5 sm:py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-xl text-xs sm:text-sm font-bold shadow-soft hover:shadow-soft-lg transition flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <Hammer className="w-3.5 h-3.5 text-roseGold-light group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>Build</span>
                    <ArrowRight className="w-3.5 h-3.5 text-roseGold-light group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 2: "MORE PRODUCTS" SIDE-BY-SIDE SECTION                              */}
      {/* 2-column mobile side-by-side grid matching user reference images         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Header matching Reference */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal font-normal tracking-tight">
            More Products
          </h2>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-taupe-700 uppercase">
            ★ Let Us Make Your Memories Last Forever ★
          </p>
        </div>

        {/* Side-by-Side Grid (2 columns on mobile, 3 on tablet, 5 on desktop) with Staggered Viewport Entrance */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 max-w-7xl mx-auto">
          {moreProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.06, duration: 0.35, ease: luxuryEase }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={prod.onClick}
              className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-taupe-200/80 shadow-xs hover:shadow-soft-lg transition-all duration-300 flex flex-col group cursor-pointer text-center"
            >
              {/* Product Photo - full uncropped fit for wide Songs Book, object-cover for portrait items */}
              <div className={`relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden ${
                prod.id === 'song-album'
                  ? 'bg-[#FAF8F5] p-1 flex items-center justify-center'
                  : 'bg-cream-100'
              } shadow-2xs border border-taupe-200/50`}>
                <img
                  src={prod.image}
                  alt={prod.alt}
                  className={`w-full h-full ${
                    prod.id === 'song-album'
                      ? 'object-contain'
                      : `object-cover ${prod.position || 'object-center'}`
                  } group-hover:scale-105 transition duration-500`}
                />
              </div>

              {/* Product Label */}
              <div className="pt-2.5 pb-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-roseGold transition-colors leading-tight">
                  {prod.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlighted Banner for Songs Book Multi-Page Layout */}
        <div className="mt-8 sm:mt-10 bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] border-2 border-roseGold/40 rounded-3xl p-6 sm:p-8 shadow-luxury text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-roseGold/10 text-roseGold px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Multi-Page Book Layout</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-bold">
            Songs Book • Physical Book Spreads
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Presented like an authentic physical printed book: <strong>Page 1 as standalone single cover</strong>, followed by <strong>Pages 2–3</strong> and <strong>Pages 4–5 as side-by-side spreads</strong> with center spine binding and realistic paper curvature.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onSelectProduct('prod-song-01')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal hover:bg-roseGold text-white rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer shadow-luxury hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Preview Songs Book Spreads Now 📖</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
