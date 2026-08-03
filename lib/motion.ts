import { Variants } from 'framer-motion';

export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up',
  delay: number = 0,
  duration: number = 0.5
): Variants => {
  return {
    hidden: {
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        delay,
        duration,
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const scaleIn = (delay: number = 0, duration: number = 0.4): Variants => {
  return {
    hidden: {
      scale: 0.92,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 250,
        delay,
        duration,
      },
    },
  };
};

export const floatingMotion: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const pulseGlow: Variants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.03, 1],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};
