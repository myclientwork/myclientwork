'use client';

import { motion, Variants } from 'framer-motion';

interface WordRevealProps {
  text: string;
  className?: string;
  gradientWords?: string[];
  delay?: number;
}

export function WordReveal({
  text,
  className = '',
  gradientWords = [],
  delay = 0,
}: WordRevealProps) {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    },
  };

  return (
    <motion.h1
      className={`flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-[0.1em] ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '');
        const isGradient = gradientWords.some(
          (gw) => gw.toLowerCase() === cleanWord.toLowerCase()
        );

        return (
          <motion.span
            key={index}
            variants={child}
            className={`inline-block ${
              isGradient ? 'text-gradient-animated font-black' : ''
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
