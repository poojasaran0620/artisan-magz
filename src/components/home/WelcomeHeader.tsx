import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { springs, luxuryEase } from '../../styles/motion';

interface WelcomeHeaderProps {
  onExploreClick: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDFCF5] to-[#FAF6F0] pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Luminous Ambient Rose-Gold & Silk Aura */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.45, 0.35] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-blush-200/40 via-roseGold-light/35 to-cream-200/60 blur-3xl pointer-events-none -z-10"
      />
      <div className="absolute -top-24 right-10 w-72 h-72 rounded-full bg-blush-100/50 blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-roseGold-light/20 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto text-center relative z-10">
        {/* Floating Boutique Welcome Card with Organic Idle Float */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: luxuryEase }}
          className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-7 sm:p-10 shadow-luxury border border-roseGold-light/40 space-y-4 hover:shadow-soft-lg transition-shadow duration-300 relative group"
        >
          {/* Gentle Floating Accent Physics */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
            className="space-y-4"
          >
            {/* Subtle Corner Accent Dot */}
            <div className="absolute top-4 right-5 flex items-center gap-1 text-[10px] text-roseGold font-medium">
              <Sparkles className="w-3 h-3 text-roseGold" />
              <span>Studio</span>
            </div>

            {/* Spaced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-[11px] sm:text-xs tracking-[0.35em] text-taupe-700 font-bold uppercase pt-1"
            >
              W E L C O M E &nbsp; T O
            </motion.p>

            {/* Logo / Brand Name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="py-2 flex items-center justify-center"
            >
              <img
                src="/artisan_logo_horizontal.png"
                alt="Artisan Magz"
                className="h-16 sm:h-20 w-auto max-w-[240px] sm:max-w-[280px] object-contain hover:scale-102 transition duration-300"
              />
            </motion.div>

            {/* Tagline in Italic Serif */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="font-serif italic text-base sm:text-lg text-charcoal/85 leading-relaxed font-normal px-2"
            >
              Editorial storytelling, printed with quiet love.
            </motion.p>

            {/* Explore Scroll Down Trigger */}
            <div className="pt-3 border-t border-taupe-200/50 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                onClick={onExploreClick}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/75 hover:text-roseGold transition-colors cursor-pointer group/btn"
                aria-label="Explore Keepsakes"
              >
                <span>Explore Keepsakes</span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-roseGold" />
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
