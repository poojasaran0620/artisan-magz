import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
  onExploreClick: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDFCF5] to-[#FAF6F0] pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Luminous Ambient Rose-Gold & Silk Aura (Option 1) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-blush-200/40 via-roseGold-light/35 to-cream-200/60 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-72 h-72 rounded-full bg-blush-100/50 blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-roseGold-light/20 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto text-center relative z-10">
        {/* Floating Boutique Welcome Card matching Reference */}
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-7 sm:p-10 shadow-luxury border border-roseGold-light/40 space-y-4 hover:shadow-soft-lg transition-all duration-300 relative group">
          {/* Subtle Corner Accent Dot */}
          <div className="absolute top-4 right-5 flex items-center gap-1 text-[10px] text-roseGold font-medium">
            <Sparkles className="w-3 h-3 text-roseGold" />
            <span>Studio</span>
          </div>

          {/* Spaced Subtitle */}
          <p className="text-[11px] sm:text-xs tracking-[0.35em] text-taupe-700 font-bold uppercase pt-1">
            W E L C O M E &nbsp; T O
          </p>

          {/* Logo / Brand Name */}
          <div className="py-2 flex items-center justify-center">
            <img
              src="/artisan_logo_horizontal.png"
              alt="Artisan Magz"
              className="h-16 sm:h-20 w-auto max-w-[240px] sm:max-w-[280px] object-contain hover:scale-102 transition duration-300"
            />
          </div>

          {/* Tagline in Italic Serif */}
          <p className="font-serif italic text-base sm:text-lg text-charcoal/85 leading-relaxed font-normal px-2">
            Editorial storytelling, printed with quiet love.
          </p>

          {/* Explore Scroll Down Trigger */}
          <div className="pt-3 border-t border-taupe-200/50 flex justify-center">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/75 hover:text-roseGold transition-colors cursor-pointer group/btn"
              aria-label="Explore Keepsakes"
            >
              <span>Explore Keepsakes</span>
              <ArrowDown className="w-3.5 h-3.5 text-roseGold group-hover/btn:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
