import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { StoryHighlight } from '../../types/product';
import { modalBackdropVariants, modalDialogVariants, buttonTapSpring } from '../../styles/motion';

interface StoryViewerModalProps {
  highlight: StoryHighlight | null;
  onClose: () => void;
  onShopCollection: (category: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  highlight,
  onClose,
  onShopCollection,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [highlight]);

  useEffect(() => {
    if (!highlight) return;

    const interval = 50; // ms
    const duration = 5000; // 5s per story
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < highlight.stories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [highlight, currentIndex, onClose]);

  const isOpen = Boolean(highlight);
  const currentStory = highlight ? highlight.stories[currentIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((curr) => curr - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (highlight && currentIndex < highlight.stories.length - 1) {
      setCurrentIndex((curr) => curr + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && highlight && currentStory && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalDialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-sm sm:max-w-md h-[80vh] max-h-[700px] bg-[#1a0c11] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {highlight.stories.map((story, i) => (
            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img
              src={highlight.coverImage}
              alt={highlight.title}
              className="w-7 h-7 rounded-full object-cover border border-white/40"
            />
            <span className="text-xs font-semibold">{highlight.title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media */}
        <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
          <img
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-contain"
          />

          {/* Tap navigation zones */}
          <div
            className="absolute top-16 bottom-20 left-0 w-1/3 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute top-16 bottom-20 right-0 w-1/3 cursor-pointer"
            onClick={handleNext}
          />

          {/* Navigation Arrows for desktop */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 items-center justify-center text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {currentIndex < highlight.stories.length - 1 && (
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 items-center justify-center text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Caption & CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 text-white space-y-2">
          <p className="text-xs text-white/95 leading-relaxed font-sans">{currentStory.caption}</p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onShopCollection(highlight.id);
              }}
              className="w-full py-2 bg-gradient-to-r from-blush-500 to-roseGold rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customize & Order This</span>
            </button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
