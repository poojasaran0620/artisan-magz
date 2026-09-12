import React, { useState, useRef, useCallback } from 'react';
import { Heart, Sparkles, ShieldCheck, Truck, Award, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface SisterSlide {
  name: string;
  role: string;
  tag: string;
  image: string;
  alt: string;
}

const SARAN_SISTERS: SisterSlide[] = [
  {
    name: 'Puja Saran',
    role: 'The Mastermind',
    tag: 'Co-Founder & Strategist',
    image: '/saran-sisters/puja_saran.png',
    alt: 'Puja Saran - The Mastermind, Artisan Magz',
  },
  {
    name: 'Rachna Saran',
    role: 'The All-Rounder',
    tag: 'Co-Founder & Operations',
    image: '/saran-sisters/rachna_saran.png',
    alt: 'Rachna Saran - The All-Rounder, Artisan Magz',
  },
  {
    name: 'Aarti Saran',
    role: 'The Creative One',
    tag: 'Co-Founder & Creative Lead',
    image: '/saran-sisters/aarti_saran.png',
    alt: 'Aarti Saran - The Creative One, Artisan Magz',
  },
];

export const AboutUsSection: React.FC = () => {
  const [currentSisterIndex, setCurrentSisterIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDraggingMouse = useRef<boolean>(false);

  const handleNextSister = useCallback(() => {
    setCurrentSisterIndex((prev) => (prev + 1) % SARAN_SISTERS.length);
  }, []);

  const handlePrevSister = useCallback(() => {
    setCurrentSisterIndex((prev) => (prev - 1 + SARAN_SISTERS.length) % SARAN_SISTERS.length);
  }, []);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      handleNextSister();
    } else if (distance < -minSwipeDistance) {
      handlePrevSister();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingMouse.current = true;
    mouseStartX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMouse.current || mouseStartX.current === null) return;
    const distance = mouseStartX.current - e.clientX;
    if (distance > minSwipeDistance) {
      handleNextSister();
      isDraggingMouse.current = false;
      mouseStartX.current = null;
    } else if (distance < -minSwipeDistance) {
      handlePrevSister();
      isDraggingMouse.current = false;
      mouseStartX.current = null;
    }
  };

  const onMouseUp = () => {
    isDraggingMouse.current = false;
    mouseStartX.current = null;
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FDFCF5] via-cream-100/50 to-[#FAF6F0] border-t border-taupe-200/60 relative overflow-hidden">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-roseGold-light/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-roseGold">
            A B O U T &nbsp; U S
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
            Our Story
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-roseGold">
            "Some memories deserve more than a camera roll."
          </p>
        </div>

        {/* Narrative Box */}
        <div className="bg-white/95 rounded-[2.5rem] p-7 sm:p-12 shadow-luxury border border-roseGold-light/40 space-y-8 max-w-4xl mx-auto text-charcoal/80 leading-relaxed text-sm sm:text-base">
          <div className="space-y-5 text-center sm:text-left">
            <p className="font-serif text-xl sm:text-2xl text-charcoal font-medium italic border-l-2 sm:border-l-4 border-roseGold pl-3 sm:pl-4 py-0.5 text-left">
              Some memories deserve more than a camera roll.
            </p>
            <p>
              We believe the best gifts aren’t always the most expensive ones. They’re the ones that make you stop, smile, and remember that one moment all over again.
            </p>
            <p>
              <strong className="text-charcoal font-semibold">Artisan Magz</strong> began in October 2024 with a simple idea — that gifting should feel personal. What started as a small idea between three sisters has grown into a personalized gifting brand built around making every gift feel as unique as the person receiving it.
            </p>
            <p>
              Whether it’s a birthday, anniversary, friendship, farewell, or simply a “I saw this and thought of you” moment — we’re here to turn that thought into something they’ll genuinely remember.
            </p>

            {/* Closing Punchline */}
            <div className="pt-3 border-t border-taupe-200/50 space-y-1">
              <p className="font-serif text-base sm:text-lg font-bold text-roseGold">
                You bring the thought.
              </p>
              <p className="font-serif text-base sm:text-lg font-bold text-roseGold">
                We’ll make it unforgettable. ♡
              </p>
            </div>
          </div>

          {/* 4 Brand Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-taupe-200/60 text-center">
            <div className="space-y-1.5 p-3 rounded-2xl bg-cream-50/70 border border-taupe-200/40">
              <BookOpen className="w-5 h-5 text-roseGold mx-auto" />
              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal">300 GSM Velvet Paper</h4>
              <p className="text-[10px] text-charcoal/60">Museum-grade archival print</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-cream-50/70 border border-taupe-200/40">
              <ShieldCheck className="w-5 h-5 text-roseGold mx-auto" />
              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal">Free PDF Proof</h4>
              <p className="text-[10px] text-charcoal/60">Approve before we print</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-cream-50/70 border border-taupe-200/40">
              <Award className="w-5 h-5 text-roseGold mx-auto" />
              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal">Handmade Wax Seal</h4>
              <p className="text-[10px] text-charcoal/60">Signature luxury packaging</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-cream-50/70 border border-taupe-200/40">
              <Truck className="w-5 h-5 text-roseGold mx-auto" />
              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal">Express Pan-India</h4>
              <p className="text-[10px] text-charcoal/60">Safe, tracked doorstep delivery</p>
            </div>
          </div>
        </div>

        {/* Meet the Saran Sisters Card */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF6F0] rounded-[2.5rem] p-7 sm:p-12 shadow-luxury border border-roseGold-light/50 max-w-4xl mx-auto text-center space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Sparkle Accent */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-roseGold/10 text-roseGold text-[11px] font-bold uppercase tracking-wider border border-roseGold/20">
            <Sparkles className="w-3.5 h-3.5 text-roseGold" />
            <span>Meet the Founders</span>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal">
              Meet the Saran Sisters
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-roseGold">
              The sisters behind Artisan Magz.
            </p>
          </div>

          {/* Swipeable Sisters Carousel */}
          <div className="relative max-w-xs sm:max-w-sm md:max-w-[420px] mx-auto py-2">
            <div
              className="relative overflow-hidden rounded-[2rem] shadow-luxury border-2 border-roseGold-light/60 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6F0] aspect-[819/1024] select-none cursor-grab active:cursor-grabbing"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {/* Slides Track with Smooth Slide Animation */}
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSisterIndex * 100}%)` }}
              >
                {SARAN_SISTERS.map((sister, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full shrink-0 flex items-center justify-center p-2 sm:p-3"
                  >
                    <img
                      src={sister.image}
                      alt={sister.alt}
                      className="w-full h-full object-contain rounded-2xl pointer-events-none drop-shadow-sm"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* Prev Navigation Button */}
              <button
                type="button"
                onClick={handlePrevSister}
                aria-label="Previous Sister"
                className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:bg-roseGold hover:text-white shadow-soft flex items-center justify-center transition-all duration-200 cursor-pointer border border-taupe-200/70 z-10 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Next Navigation Button */}
              <button
                type="button"
                onClick={handleNextSister}
                aria-label="Next Sister"
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:bg-roseGold hover:text-white shadow-soft flex items-center justify-center transition-all duration-200 cursor-pointer border border-taupe-200/70 z-10 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Slide Indicator Dots (Discreet, No Names) */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {SARAN_SISTERS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSisterIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSisterIndex === idx
                      ? 'w-6 h-2 bg-roseGold'
                      : 'w-2 h-2 bg-taupe-300 hover:bg-taupe-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Three Sisters Pill Highlight */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1">
            <span className="px-4 py-1.5 rounded-full bg-cream-100 border border-taupe-200/80 font-serif font-bold text-xs sm:text-sm text-charcoal shadow-xs">
              Pooja Saran
            </span>
            <span className="text-roseGold font-bold">•</span>
            <span className="px-4 py-1.5 rounded-full bg-cream-100 border border-taupe-200/80 font-serif font-bold text-xs sm:text-sm text-charcoal shadow-xs">
              Rachna Saran
            </span>
            <span className="text-roseGold font-bold">•</span>
            <span className="px-4 py-1.5 rounded-full bg-cream-100 border border-taupe-200/80 font-serif font-bold text-xs sm:text-sm text-charcoal shadow-xs">
              Aarti Saran
            </span>
          </div>

          {/* Sisters Story Narrative */}
          <div className="max-w-2xl mx-auto space-y-4 text-charcoal/80 text-sm sm:text-base leading-relaxed">
            <p>
              Three sisters, one shared idea, and a love for making gifting a little more personal.
            </p>
            <p>
              What started in October 2024 as something we created together has become a brand we’re continuing to build together — with creativity, care, and a lot of heart.
            </p>
          </div>

          {/* Signature Footer */}
          <div className="pt-5 border-t border-taupe-200/60 max-w-md mx-auto space-y-1">
            <p className="font-serif text-base sm:text-lg font-bold text-charcoal">
              Pooja · Rachna · Aarti
            </p>
            <p className="text-xs sm:text-sm text-charcoal/70 italic">
              The people behind the ideas, the details, and every little bit of Artisan Magz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
