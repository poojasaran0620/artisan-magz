import React from 'react';
import { ArrowLeft } from 'lucide-react';

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

interface AboutUsSectionProps {
  onBack?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onBack }) => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FDFCF5] via-cream-100/50 to-[#FAF6F0] min-h-[80vh] border-t border-taupe-200/60 relative overflow-hidden">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-roseGold-light/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Optional Back Button */}
        {onBack && (
          <div className="flex items-center justify-start">
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal/70 hover:text-roseGold transition cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-taupe-200/70 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-roseGold" />
              <span>Back to Home</span>
            </button>
          </div>
        )}
        {/* Header: Meet the Founders in cute pink text */}
        <div className="text-center">
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#D97C90] font-normal tracking-wide drop-shadow-xs">
            Meet the Founders
          </h2>
        </div>

        {/* 1. Meet the Founders & Saran Sisters Card */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF6F0] rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-luxury border border-roseGold-light/50 max-w-2xl mx-auto text-center space-y-8 relative overflow-hidden">
          {/* Vertical Stack of Expanded Images */}
          <div className="space-y-6 max-w-lg mx-auto w-full">
            {SARAN_SISTERS.map((sister, idx) => (
              <div
                key={idx}
                className="bg-white p-2 sm:p-2.5 rounded-[2rem] shadow-soft border border-roseGold-light/60 transition hover:shadow-soft-lg"
              >
                <img
                  src={sister.image}
                  alt={sister.alt}
                  className="w-full h-auto object-contain rounded-[1.6rem] block"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>


          {/* 2. Text: Three Sisters, One Shared Idea */}
          <div className="max-w-xl mx-auto space-y-4 text-charcoal/80 text-sm sm:text-base leading-relaxed">
            <p>
              Three sisters, one shared idea, and a love for making gifting a little more personal.
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

        {/* 3. Our Story Narrative Box */}
        <div className="bg-white/95 rounded-[2.5rem] p-7 sm:p-12 shadow-luxury border border-roseGold-light/40 space-y-8 max-w-4xl mx-auto text-charcoal/80 leading-relaxed text-sm sm:text-base">
          <div className="text-center space-y-2 pb-2 border-b border-taupe-200/50">
            <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#D97C90] font-normal tracking-wide drop-shadow-xs">
              Our Story
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-roseGold">
              "Some memories deserve more than a camera roll."
            </p>
          </div>

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
        </div>
      </div>
    </section>
  );
};
