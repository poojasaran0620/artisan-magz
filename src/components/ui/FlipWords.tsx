import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

/**
 * FlipWords component
 * Inspired by shadcn.io/text/flip-words
 * Dynamically cycles words with a luxury vertical slide + blur reveal.
 */
export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 2600,
  className = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const startAnimation = useCallback(() => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      startAnimation();
    }, duration);
    return () => clearInterval(interval);
  }, [isHovered, duration, startAnimation]);

  const currentWord = words[currentWordIndex] || words[0];

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block relative px-2 py-0.5 rounded-full bg-roseGold-light/25 border border-roseGold-light/40 shadow-sm ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block font-serif italic font-semibold text-roseGold tracking-wide"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
