import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '../../data/faqData';
export { FAQ_DATA };

interface FAQSectionProps {
  onBack?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#FDFCF5] via-cream-100/40 to-[#FAF6F0] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Soft Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-roseGold-light/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Back Button */}
        {onBack && (
          <div>
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

        {/* FAQ Card */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-luxury border border-roseGold-light/40 space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/60">
              Got questions? We've got answers.
            </p>
          </div>

          {/* Accordion List */}
          <div className="divide-y divide-taupe-200/80 border-y border-taupe-200/80">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer group gap-4"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isOpen ? 'text-roseGold' : 'text-charcoal group-hover:text-roseGold'
                      }`}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-roseGold' : 'text-taupe-400 group-hover:text-charcoal'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-4 sm:pb-5 text-xs sm:text-sm text-charcoal/70 leading-relaxed animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Extra Help Banner */}
          <div className="pt-4 border-t border-taupe-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold text-charcoal">Still have a question?</p>
              <p className="text-[11px] text-charcoal/60">We are always happy to help with your personalized gift.</p>
            </div>
            <a
              href="https://wa.me/917000041053?text=Hi%20Artisan%20Magz!%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sage-50 text-sage-800 border border-sage-200 hover:bg-sage-100 text-xs font-semibold transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sage" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
