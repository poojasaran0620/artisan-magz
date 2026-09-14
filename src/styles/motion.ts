import { Transition, Variants } from 'framer-motion';

/**
 * Standardized Spring Tokens for Artisan Magz
 * Tuned for luxury boutique responsiveness: snappy, tactile, never sluggish.
 */
export const springs = {
  snappy: {
    type: 'spring',
    stiffness: 450,
    damping: 28,
  } as Transition,
  smooth: {
    type: 'spring',
    stiffness: 320,
    damping: 30,
  } as Transition,
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  } as Transition,
  gentle: {
    type: 'spring',
    stiffness: 200,
    damping: 24,
  } as Transition,
};

/**
 * Premium Cubic-Bezier Easing
 */
export const luxuryEase = [0.16, 1, 0.3, 1] as const;

/**
 * Reusable Framer Motion Variants
 */

// Fade in and slide up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: luxuryEase,
    },
  },
};

// Fade in without translation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: luxuryEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Staggered container for lists, grids, and sequences
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Modal & Dialog backdrop overlay
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// Modal dialog content container (spring pop-in and smooth scale-down exit)
export const modalDialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 12,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
};

// Slide-out Drawer (Cart Drawer, Sidenav, Filters)
export const drawerSlideRightVariants: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 320, mass: 0.8 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.28, ease: [0.32, 1, 0.23, 1] },
  },
};

export const drawerSlideLeftVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 320, mass: 0.8 },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.28, ease: [0.32, 1, 0.23, 1] },
  },
};

// Interactive Button Springs
export const buttonTapSpring = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.96 },
  transition: springs.snappy,
};

// Card Hover Physics
export const cardHoverSpring = {
  whileHover: {
    y: -6,
    transition: springs.smooth,
  },
};
