import React from 'react';
import { ArrowRight, Hammer } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

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
      image: songProduct?.images[0] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
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
      <div className="relative overflow-hidden my-4">
        {/* Top Organic Wave Curve Divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-7 sm:h-10 text-[#FDFCF5]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.5,201.21,114.7,242.47,110.74,282.72,97.77,321.39,56.44Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Highlighted Banner Canvas with Brand-Matching Gradient */}
        <div className="bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 relative shadow-luxury">
          {/* Subtle Ambient Glow and Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-6">
            {/* Header: Script Cursive "Best Selling" */}
            <div className="text-center space-y-1">
              <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#FDFCF5] font-normal tracking-wide drop-shadow-sm">
                Best Selling
              </h2>
              <p className="text-xs text-[#FDFCF5]/85 max-w-md mx-auto">
                Handcrafted treasures voted customer favorites across India.
              </p>
            </div>

            {/* Spotlight Single Bestseller Card: Custom Magazine */}
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 text-charcoal shadow-luxury border border-white/60 flex flex-col items-center text-center gap-3.5 group hover:-translate-y-0.5 transition duration-300 relative overflow-hidden">
                {/* Bestseller Crown Tag */}
                <div className="absolute top-2.5 right-2.5 z-10 bg-charcoal text-[#FDFCF5] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
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

                  <button
                    type="button"
                    onClick={() => onSelectProduct(magazineProduct.id)}
                    className="w-full py-2.5 sm:py-3 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-xl text-xs sm:text-sm font-bold shadow-soft hover:shadow-soft-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <Hammer className="w-3.5 h-3.5 text-roseGold-light group-hover/btn:rotate-12 transition-transform" />
                    <span>Build</span>
                    <ArrowRight className="w-3.5 h-3.5 text-roseGold-light group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Organic Wave Curve Divider */}
        <div className="w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-7 sm:h-10 text-[#FDFCF5]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.5,201.21,114.7,242.47,110.74,282.72,97.77,321.39,56.44Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 2: "MORE PRODUCTS" SIDE-BY-SIDE SECTION                              */}
      {/* 2-column mobile side-by-side grid matching user reference images         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header matching Reference */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            More Products
          </h2>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-taupe-700 uppercase">
            ★ Let Us Make Your Memories Last Forever ★
          </p>
        </div>

        {/* Side-by-Side Grid (2 columns on mobile, 3 on tablet, 5 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 max-w-7xl mx-auto">
          {moreProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={prod.onClick}
              className="bg-white rounded-3xl p-2.5 sm:p-3 border border-taupe-200/80 shadow-luxury hover:shadow-soft-lg transition-all duration-300 flex flex-col group cursor-pointer text-center hover:-translate-y-1"
            >
              {/* Product Photo - flush fit without empty whitespace */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 shadow-xs border border-taupe-200/50">
                <img
                  src={prod.image}
                  alt={prod.alt}
                  className={`w-full h-full object-cover ${prod.position || 'object-center'} group-hover:scale-105 transition duration-500`}
                />
              </div>

              {/* Product Label */}
              <div className="pt-2.5 pb-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-roseGold transition-colors leading-tight">
                  {prod.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
