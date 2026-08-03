'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltEffect?: boolean;
}

export function FloatingCard({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.15)',
  tiltEffect = true,
  ...props
}: FloatingCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect) return;
    const card = e.currentTarget.getBoundingClientRect();
    const cardCenterX = card.left + card.width / 2;
    const cardCenterY = card.top + card.height / 2;
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;

    const rX = (mouseY / (card.height / 2)) * -6;
    const rY = (mouseX / (card.width / 2)) * 6;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-2xl',
        className
      )}
      {...(props as any)}
    >
      {/* Subtle Glow Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at center, ${glowColor}, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
