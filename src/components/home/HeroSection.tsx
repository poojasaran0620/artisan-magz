import React from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowDown,
  Play,
  Volume2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { InteractiveFlipbook } from '../magazine/InteractiveFlipbook';
import { SAMPLE_MAGAZINE_PAGES } from '../../data/sampleMagazinePages';

interface HeroSectionProps {
  onExploreClick: () => void;
  onHamperClick: () => void;
  onProductClick: (productId: string, templateId?: string, variantId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHamperClick,
  onProductClick,
}) => {

  const handleScrollToCategories = () => {
    const el = document.getElementById('product-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreClick();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FDFCF5] via-blush-50/50 to-[#FDFCF5] pt-6 pb-14 lg:pt-10 lg:pb-20">
      {/* Background ambient blurs */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blush-100/40 via-roseGold-light/25 to-cream-100/50 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Brand Identity & Minimalist Headline */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Micro Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-100 border border-blush-200/80 text-xs font-semibold text-charcoal">
                <Sparkles className="w-3.5 h-3.5 text-roseGold" />
                <span>Personalized Keepsake Gifting Studio</span>
              </span>
            </div>

            {/* Main Romantic Serif Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal tracking-tight leading-[1.12]">
              Turn your memories into a{' '}
              <span className="italic font-serif font-medium bg-gradient-to-r from-roseGold via-taupe-600 to-roseGold bg-clip-text text-transparent">
                glossy custom magazine.
              </span>
            </h1>

            {/* 1-Line Elegant Sub-tagline */}
            <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Vogue-grade velvet matte prints, handcrafted love chronicles, and scannable Spotify songs — made for your most unforgettable milestones.
            </p>

            {/* Visual Micro-Chips (Replacing heavy text boxes) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-taupe-200 text-xs font-medium text-charcoal shadow-xs">
                ✨ 300 GSM Velvet Touch
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-taupe-200 text-xs font-medium text-charcoal shadow-xs">
                🎵 Scannable Spotify Song
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-taupe-200 text-xs font-medium text-charcoal shadow-xs">
                💬 WhatsApp Proof Before Printing
              </span>
            </div>

            {/* EXPLORE PRODUCTS TAB / MAIN CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={handleScrollToCategories}
                className="w-full sm:w-auto px-8 py-4 bg-charcoal hover:bg-charcoal-dark text-[#FDFCF5] rounded-full font-bold text-sm shadow-soft hover:shadow-soft-lg active:scale-95 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowDown className="w-4 h-4 text-roseGold-light group-hover:translate-y-1 transition duration-200" />
              </button>

              <button
                onClick={() => onProductClick('prod-mag-01')}
                className="w-full sm:w-auto px-6 py-4 bg-[#FDFCF5] hover:bg-cream-100 text-charcoal rounded-full font-semibold text-sm border border-roseGold shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-roseGold" />
                <span>Customize (8 to 20 Pages)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual-First Interactive 3D Magazine Player */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Interactive Magazine Preview Box */}
              <div className="rounded-3xl bg-white p-3.5 sm:p-5 shadow-luxury border border-taupe-200/80 relative overflow-hidden">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-taupe-200/60 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-roseGold animate-pulse" />
                    <span className="text-xs font-bold text-charcoal tracking-wide">
                      Interactive Flipbook Preview
                    </span>
                  </div>
                  <span className="text-[10px] bg-blush-100 text-roseGold font-bold px-2.5 py-0.5 rounded-full border border-roseGold/20">
                    Live 3D Pages
                  </span>
                </div>

                {/* 3D Interactive Magazine Flipbook Component */}
                <div className="relative z-10 py-1">
                  <InteractiveFlipbook
                    pages={SAMPLE_MAGAZINE_PAGES}
                    magazineTitle="The Love Chronicle"
                    onCustomizeClick={() => onProductClick('prod-mag-01')}
                  />
                </div>

                {/* Interactive Variant Quick Pickers (8, 12, 16, 20 Pages) */}
                <div className="mt-4 pt-3 border-t border-taupe-200/60">
                  <div className="flex items-center justify-between text-[11px] mb-2 font-medium text-charcoal/80">
                    <span>Select Page Variant:</span>
                    <span className="text-roseGold font-bold">Tap to customize</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { pages: '8 Pages', price: '₹899', id: 'mag-8p' },
                      { pages: '12 Pages', price: '₹1,199', id: 'mag-12p' },
                      { pages: '16 Pages', price: '₹1,499', id: 'mag-16p' },
                      { pages: '20 Pages', price: '₹1,799', id: 'mag-20p' },
                    ].map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => onProductClick('prod-mag-01', undefined, variant.id)}
                        className="py-1.5 px-1 rounded-xl bg-cream-50 hover:bg-blush-100/70 border border-taupe-200 text-center transition group cursor-pointer"
                      >
                        <span className="block text-[11px] font-bold text-charcoal group-hover:text-roseGold">
                          {variant.pages}
                        </span>
                        <span className="block text-[10px] text-roseGold font-medium">
                          {variant.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Mini Keepsake Accent: Desktop Frame */}
              <div
                onClick={() => onProductClick('prod-frame-01')}
                className="hidden sm:flex absolute -bottom-5 -left-8 z-30 bg-white p-2 rounded-2xl shadow-luxury border border-taupe-200/80 items-center gap-2.5 cursor-pointer hover:-translate-y-1 transition max-w-[190px]"
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                  <img
                    src="/products/media_1788608467334.jpg"
                    alt="Mini Desktop Frame"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold text-charcoal truncate">Mini Frames</p>
                  <p className="text-[10px] text-roseGold font-semibold">From ₹599</p>
                </div>
              </div>

              {/* Floating Mini Keepsake Accent: Newspaper Card */}
              <div
                onClick={() => onProductClick('prod-news-01')}
                className="hidden sm:flex absolute -top-5 -right-6 z-30 bg-white p-2 rounded-2xl shadow-luxury border border-taupe-200/80 items-center gap-2.5 cursor-pointer hover:-translate-y-1 transition max-w-[190px]"
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                  <img
                    src="/products/media_1788608467346.jpg"
                    alt="Newspaper Card"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold text-charcoal truncate">Newspaper Card</p>
                  <p className="text-[10px] text-roseGold font-semibold">From ₹499</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

