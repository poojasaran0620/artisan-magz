import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react';
import { FRAME_OPTIONS, FrameOption } from '../../data/frameOptions';
import { formatPrice } from '../../utils/formatters';
import { springs, buttonTapSpring } from '../../styles/motion';

interface FramesCollectionPageProps {
  onSelectFrame: (frame: FrameOption) => void;
  onBack: () => void;
}

export const FramesCollectionPage: React.FC<FramesCollectionPageProps> = ({
  onSelectFrame,
  onBack,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const filterChips = [
    { id: 'all', label: 'All Frames' },
    { id: 'playing-cards', label: 'Playing Cards 🃏' },
    { id: 'scrapbook', label: 'Scrapbook & Filmstrip 🎀' },
    { id: 'love-notes', label: 'Love Note Strips ✈️' },
    { id: 'newspaper', label: 'Newspaper 📰' },
    { id: 'cutout', label: 'Cutout Collages 💖' },
    { id: 'mosaic', label: 'Chaos Mosaic ✨' },
    { id: 'spotify', label: 'Spotify Soundwave 🎵' },
  ];

  const filteredFrames = useMemo(() => {
    let list = [...FRAME_OPTIONS];

    if (activeFilter === 'playing-cards') {
      list = list.filter((f) => f.id.includes('playing-cards'));
    } else if (activeFilter === 'scrapbook') {
      list = list.filter((f) => f.id.includes('scrapbook'));
    } else if (activeFilter === 'love-notes') {
      list = list.filter((f) => f.id.includes('paper-plane'));
    } else if (activeFilter === 'newspaper') {
      list = list.filter((f) => f.id.includes('newspaper'));
    } else if (activeFilter === 'cutout') {
      list = list.filter((f) => f.id.includes('cutout'));
    } else if (activeFilter === 'mosaic') {
      list = list.filter((f) => f.id.includes('chaos'));
    } else if (activeFilter === 'spotify') {
      list = list.filter((f) => f.id.includes('spotify'));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFCF5] pb-20">
      {/* Top Header Bar (matches Anchor Customs reference UI) */}
      <div className="sticky top-0 z-30 bg-[#FDFCF5]/95 backdrop-blur-md border-b border-taupe-200/60 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Back button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTapSpring}
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-taupe-300/80 bg-white hover:bg-cream-100 text-charcoal text-xs sm:text-sm font-medium shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-taupe-600" />
            <span>All Categories</span>
          </motion.button>

          {/* Sorting Dropdown */}
          <div className="relative">
            <motion.button
              type="button"
              whileTap={buttonTapSpring}
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-taupe-300/80 bg-white hover:bg-cream-100 text-charcoal text-xs sm:text-sm font-medium shadow-2xs transition cursor-pointer"
            >
              <span>
                {sortBy === 'default' && 'Default Sorting'}
                {sortBy === 'price-asc' && 'Price: Low to High'}
                {sortBy === 'price-desc' && 'Price: High to Low'}
                {sortBy === 'popular' && 'Most Popular'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-taupe-600 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-luxury border border-taupe-200 py-1.5 z-40"
                >
                  {[
                    { id: 'default', label: 'Default Sorting' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                    { id: 'popular', label: 'Most Popular' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSortBy(item.id as any);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition cursor-pointer ${
                        sortBy === item.id
                          ? 'font-bold text-roseGold bg-blush-50'
                          : 'text-charcoal hover:bg-cream-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hero Category Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-blush-100 text-roseGold px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Keepsake Frames</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl text-charcoal font-bold tracking-tight">
            Personalized Photo Frames
          </h1>
          <p className="text-xs sm:text-sm text-taupe-700 max-w-md mx-auto">
            Choose your favorite frame layout below to personalize with your memories, dates & custom messages.
          </p>
        </div>

        {/* Filter Pills with Apple-style sliding highlight */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 justify-start sm:justify-center">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-charcoal/80 hover:text-charcoal'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFrameFilterPill"
                    className="absolute inset-0 bg-charcoal rounded-full -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white border border-taupe-200 rounded-full -z-20 hover:bg-cream-100" />
                )}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Mobile / 4-Column Desktop Frames Grid with Framer Motion Layout Reordering */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFrames.map((frame) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                key={frame.id}
                onClick={() => onSelectFrame(frame)}
                role="button"
                tabIndex={0}
                className="bg-white rounded-3xl p-2.5 sm:p-4 border border-taupe-200/80 shadow-luxury flex flex-col justify-between group cursor-pointer text-center focus:outline-none transition-shadow duration-300"
              >
                <div className="space-y-2.5">
                  {/* Full Uncropped Photo Container */}
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#FAF8F5] shadow-xs border border-taupe-200/40 flex items-center justify-center p-1 sm:p-2">
                    <img
                      src={frame.image}
                      alt={frame.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                    />
                    {frame.badge && (
                      <span className="absolute top-2 left-2 bg-[#FDFCF5]/95 backdrop-blur-xs text-charcoal text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-taupe-200/60">
                        {frame.badge}
                      </span>
                    )}
                  </div>

                  {/* Frame Title & Pricing */}
                  <div className="pt-1">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-roseGold transition-colors leading-tight">
                      {frame.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-sans text-xs sm:text-sm text-charcoal font-bold tabular-nums">
                        {formatPrice(frame.price)}
                      </span>
                      <span className="font-sans text-[10px] sm:text-xs text-taupe-500 line-through tabular-nums">
                        {formatPrice(frame.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tap to Personalize Indicator */}
                <div className="pt-2 mt-2 border-t border-taupe-100">
                  <span className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-roseGold group-hover:underline">
                    <span>Customize Options</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
