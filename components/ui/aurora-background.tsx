'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dynamic Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-mask opacity-70" />

      {/* Aurora Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top Centered Aurora Cloud */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.65, 0.4],
            rotate: [0, 4, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/25 to-purple-600/20 blur-[120px]"
        />

        {/* Right Floating Indigo Glowing Orb */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/3 -right-20 -z-10 h-[450px] w-[450px] rounded-full bg-indigo-500/15 blur-[100px]"
        />

        {/* Left Floating Cyan Glowing Orb */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 -left-20 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[100px]"
        />
      </div>

      {children}
    </div>
  );
}
