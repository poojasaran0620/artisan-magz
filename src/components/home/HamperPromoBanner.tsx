import React from 'react';
import { Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HamperPromoBannerProps {
  onStartHamper: () => void;
}

export const HamperPromoBanner: React.FC<HamperPromoBannerProps> = ({ onStartHamper }) => {
  return (
    <section className="py-12 bg-gradient-to-r from-cream-100 via-blush-50 to-cream-100 border-y border-roseGold-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-luxury border border-blush-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hamper Box Photo */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-soft-lg aspect-[4/3] bg-cream-100">
              <img
                src="/products/media_1788608467331.jpg"
                alt="Personalized Hamper Box with Nails, Jhumkas, Scrunchie, Mini Frame and Keychain"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-serif italic">
                  Real unboxing photo sent by our bride customer in Mumbai 🌸
                </span>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 bg-blush-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>100% Customizable</span>
            </div>
          </div>

          {/* Right Column: Explainer Steps & CTA */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blush-600 uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5" />
                <span>Interactive Hamper Bar</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-wine-900 font-normal leading-tight">
                Build your dream gift hamper in 3 easy steps.
              </h2>
              <p className="text-xs sm:text-sm text-wine-900/70 leading-relaxed">
                Skip generic gift baskets! Handpick items tailored precisely to her aesthetic taste, and watch your hamper tally dynamically as you add treats.
              </p>
            </div>

            {/* 3 Step Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="w-6 h-6 rounded-full bg-blush-200 text-blush-800 text-xs font-bold flex items-center justify-center mb-2">
                  1
                </span>
                <h4 className="text-xs font-bold text-wine-900">Choose Box</h4>
                <p className="text-[11px] text-wine-900/60 mt-0.5">Pastel Blush, Vintage Pine, or Midnight Wine</p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="w-6 h-6 rounded-full bg-blush-200 text-blush-800 text-xs font-bold flex items-center justify-center mb-2">
                  2
                </span>
                <h4 className="text-xs font-bold text-wine-900">Pick Goodies</h4>
                <p className="text-[11px] text-wine-900/60 mt-0.5">Scrunchies, Jhumkas, Nails, Mini Frame & more</p>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="w-6 h-6 rounded-full bg-blush-200 text-blush-800 text-xs font-bold flex items-center justify-center mb-2">
                  3
                </span>
                <h4 className="text-xs font-bold text-wine-900">Wax Seal Card</h4>
                <p className="text-[11px] text-wine-900/60 mt-0.5">Handwritten cursive note with authentic red wax</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onStartHamper}
                className="w-full sm:w-auto px-7 py-3 bg-wine-900 hover:bg-wine-800 text-white rounded-full text-xs sm:text-sm font-semibold shadow-soft hover:shadow-soft-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Hamper Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] text-wine-900/60 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live 3D-style basket preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
