import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FAQ_DATA } from '../../data/faqData';
import { luxuryEase, springs } from '../../styles/motion';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';

export { FAQ_DATA };

interface FAQSectionProps {
  onBack?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onBack }) => {
  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#FDFCF5] via-cream-100/40 to-[#FAF6F0] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Soft Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-roseGold-light/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Back Button */}
        {onBack && (
          <div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal/70 hover:text-roseGold transition-colors cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-taupe-200/70 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-roseGold" />
              <span>Back to Home</span>
            </motion.button>
          </div>
        )}

        {/* FAQ Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: luxuryEase }}
          className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-luxury border border-roseGold-light/40 space-y-8"
        >
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/60">
              Got questions? We've got answers.
            </p>
          </div>

          {/* Accordion List with Radix/shadcn */}
          <Accordion type="single" collapsible className="w-full border-t border-taupe-200/80">
            {FAQ_DATA.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="group">
                  <span className="text-xs sm:text-sm font-semibold transition-colors group-hover:text-roseGold text-charcoal">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Extra Help Banner */}
          <div className="pt-4 border-t border-taupe-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold text-charcoal">Still have a question?</p>
              <p className="text-[11px] text-charcoal/60">We are always happy to help with your personalized gift.</p>
            </div>
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              href="https://wa.me/917000041053?text=Hi%20Artisan%20Magz!%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sage-50 text-sage-800 border border-sage-200 hover:bg-sage-100 text-xs font-semibold transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sage" />
              <span>Chat on WhatsApp</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
