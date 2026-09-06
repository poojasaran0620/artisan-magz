import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Newspaper,
  Music,
  ArrowRight,
  Eye,
  CheckCircle2,
  Palette,
  Hammer,
} from 'lucide-react';
import { PRODUCTS, MAGAZINE_TEMPLATES } from '../../data/products';
import { MagazineTemplate } from '../../types/product';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface ProductCategoriesSectionProps {
  onSelectProduct: (productId: string, templateId?: string, variantId?: string) => void;
  onHamperClick: () => void;
}

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  onSelectProduct,
  onHamperClick,
}) => {
  const [previewingTemplate, setPreviewingTemplate] = useState<MagazineTemplate | null>(null);

  // Referenced Products
  const magazineProduct = PRODUCTS.find((p) => p.id === 'prod-mag-01') || PRODUCTS[0];
  const frameProduct = PRODUCTS.find((p) => p.id === 'prod-frame-01') || PRODUCTS[1];
  const miniMagProduct = PRODUCTS.find((p) => p.id === 'prod-mini-mag-01');
  const songProduct = PRODUCTS.find((p) => p.id === 'prod-song-01');
  const newspaperProduct = PRODUCTS.find((p) => p.id === 'prod-news-01');

  // "More Products" collection (exact 5 requested side-by-side)
  const moreProducts = [
    {
      id: 'frames',
      title: 'Photo Frames',
      badge: '',
      price: '',
      hideCustomiseButton: true,
      image: '/products/playing_cards_frame.jpg',
      alt: 'Personalized Photo Frames',
      onClick: () => onSelectProduct(frameProduct.id),
    },
    {
      id: 'hampers',
      title: 'Gift Hampers',
      badge: 'Interactive 🎁',
      price: 'From ₹1,299',
      image: '/products/media_1788608467331.jpg',
      alt: 'Curated Gift Hampers',
      onClick: onHamperClick,
    },
    {
      id: 'mini-magazine',
      title: 'Mini Magazine',
      badge: 'Pocket Size 🌸',
      price: 'From ₹699',
      image: miniMagProduct?.images[0] || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      alt: '8-Page Mini Magazine',
      onClick: () => miniMagProduct && onSelectProduct(miniMagProduct.id),
    },
    {
      id: 'song-album',
      title: 'Song Photo Album',
      badge: 'Spotify Code 🎵',
      price: 'From ₹749',
      image: songProduct?.images[0] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      alt: 'Song Book & Spotify Plaque',
      onClick: () => songProduct && onSelectProduct(songProduct.id),
    },
    {
      id: 'newspaper',
      title: 'Newspaper Card',
      badge: 'Vintage 📰',
      price: 'From ₹499',
      image: '/products/media_1788608467346.jpg',
      alt: 'Vintage Newspaper Frame',
      onClick: () => newspaperProduct && onSelectProduct(newspaperProduct.id),
    },
  ];

  return (
    <section id="product-categories" className="py-8 sm:py-12 bg-[#FDFCF5] scroll-mt-20">
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
        <div className="bg-gradient-to-br from-[#9E7864] via-[#B76E79] to-[#804D55] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative shadow-luxury">
          {/* Subtle Ambient Glow and Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-8">
            {/* Header: Script Cursive "Best Selling" */}
            <div className="text-center space-y-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#FFDBE5] font-bold">
                Most Loved Keepsakes
              </span>
              <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#FDFCF5] font-normal tracking-wide drop-shadow-sm">
                Best Selling
              </h2>
              <p className="text-xs sm:text-sm text-[#FDFCF5]/85 max-w-md mx-auto">
                Handcrafted treasures voted customer favorites across India.
              </p>
            </div>

            {/* Spotlight Single Bestseller Card: Custom Magazine */}
            <div className="max-w-md md:max-w-2xl mx-auto">
              <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-6 text-charcoal shadow-luxury border border-white/60 flex flex-col sm:flex-row gap-5 sm:gap-6 group hover:-translate-y-0.5 transition duration-300 relative overflow-hidden">
                {/* Bestseller Crown Tag */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-charcoal text-[#FDFCF5] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                  <span>#1 Bestseller 🔥</span>
                </div>

                {/* Magazine Visual */}
                <div
                  onClick={() => onSelectProduct(magazineProduct.id)}
                  className="w-full sm:w-5/12 shrink-0 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 shadow-sm border border-taupe-200/50">
                    <img
                      src={magazineProduct.images[0]}
                      alt="Custom Magazine Gifting"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-charcoal/85 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] flex items-center justify-between font-mono">
                      <span>8 to 20 Pages</span>
                      <span className="text-roseGold-light font-bold">From ₹899</span>
                    </div>
                  </div>
                </div>

                {/* Content & Call-to-Actions */}
                <div className="w-full sm:w-7/12 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-roseGold">
                      Flagship Keepsake
                    </span>
                    <h3
                      onClick={() => onSelectProduct(magazineProduct.id)}
                      className="font-serif text-xl sm:text-2xl font-bold text-charcoal hover:text-roseGold transition-colors cursor-pointer"
                    >
                      Custom Magazines
                    </h3>
                    <p className="text-xs sm:text-sm text-taupe-700 leading-relaxed">
                      Glossy velvet prints with your custom love chronicles, interviews, photo collage spreads, and playable Spotify anthem.
                    </p>
                    
                    {/* Key Perks */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-taupe-100 text-taupe-800 font-medium px-2 py-0.5 rounded-full">
                        ✨ Velvet Matte
                      </span>
                      <span className="text-[10px] bg-taupe-100 text-taupe-800 font-medium px-2 py-0.5 rounded-full">
                        📖 3D Flipbook
                      </span>
                      <span className="text-[10px] bg-taupe-100 text-taupe-800 font-medium px-2 py-0.5 rounded-full">
                        🎵 Spotify Dedication
                      </span>
                    </div>
                  </div>

                  {/* Direct Action: Build Magazine */}
                  <div className="pt-3 border-t border-taupe-200/50 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(magazineProduct.id)}
                      className="w-full py-3 sm:py-3.5 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-2xl text-xs sm:text-sm font-bold shadow-luxury hover:shadow-soft-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer group/btn"
                    >
                      <Hammer className="w-4 h-4 text-roseGold-light group-hover/btn:rotate-12 transition-transform" />
                      <span>Build Your Magazine</span>
                      <ArrowRight className="w-4 h-4 text-roseGold-light" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewingTemplate(MAGAZINE_TEMPLATES[0])}
                      className="w-full py-2 bg-cream-100 hover:bg-blush-100/60 text-charcoal rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-roseGold" />
                      <span>Preview 3D Spreads</span>
                    </button>
                  </div>
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
            ★ Turn Your Memories Into Something Special ★
          </p>
        </div>

        {/* Side-by-Side Grid (2 columns on mobile, 5 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {moreProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={prod.onClick}
              className="bg-white rounded-3xl p-3 sm:p-4 border border-taupe-200/80 shadow-luxury hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer text-center hover:-translate-y-1"
            >
              <div className="space-y-2.5">
                {/* Product Photo - full uncropped view */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF8F5] shadow-xs border border-taupe-200/50 flex items-center justify-center p-1.5">
                  <img
                    src={prod.image}
                    alt={prod.alt}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                  />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 bg-[#FDFCF5]/90 backdrop-blur-xs text-charcoal text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-taupe-200/60">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Product Label */}
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-roseGold transition-colors leading-tight">
                    {prod.title}
                  </h3>
                  {prod.price && (
                    <p className="text-[11px] text-roseGold font-semibold mt-1">
                      {prod.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Tap Indicator */}
              {!prod.hideCustomiseButton && (
                <div className="pt-2.5 border-t border-taupe-200/50 mt-2">
                  <span className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-charcoal/80 group-hover:text-charcoal">
                    <span>Customise</span>
                    <ArrowRight className="w-3 h-3 text-roseGold group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 3: MAGAZINE TEMPLATES ACCORDION (OPTIONAL FOR BROWSING THEMES)       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="border-t border-taupe-200/60 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 text-roseGold text-xs font-semibold uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>Templates Provided By Us</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal mt-1">
                Explore Magazine Cover Themes
              </h3>
              <p className="text-xs sm:text-sm text-taupe-700">
                Browse our editorial aesthetics. Tap any design to open the interactive 3D page flipbook preview.
              </p>
            </div>
            <span className="text-xs text-taupe-600 font-medium">
              5 Styles Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {MAGAZINE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setPreviewingTemplate(tmpl)}
                className="bg-white rounded-2xl overflow-hidden border border-taupe-200/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer text-center p-2.5"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream-100">
                    <img
                      src={tmpl.coverImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold backdrop-blur-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Flip Pages</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal truncate">
                      {tmpl.name}
                    </h4>
                    <p className="text-[10px] text-roseGold truncate font-medium">
                      {tmpl.suitableFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Magazine Template Interactive Modal */}
      <TemplatePreviewModal
        template={previewingTemplate}
        onClose={() => setPreviewingTemplate(null)}
        onSelectTemplate={(templateId) => {
          onSelectProduct(magazineProduct.id, templateId);
        }}
      />
    </section>
  );
};
