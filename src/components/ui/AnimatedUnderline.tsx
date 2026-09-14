import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedUnderlineProps {
  color?: string;
  delay?: number;
  className?: string;
}

/**
 * AnimatedUnderline component
 * Inspired by shadcn.io/text/annotation-text
 * Renders an authentic, hand-drawn calligraphic fountain pen stroke.
 */
export const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({
  color = '#C5A059',
  delay = 0.4,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 260 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none ${className}`}
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 2 12 C 45 4, 115 15, 175 7 C 215 2, 245 13, 258 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{
          pathLength: { delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          opacity: { delay, duration: 0.3 },
        }}
      />
    </svg>
  );
};
