'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WordReveal } from '@/components/ui/word-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { AuroraBackground } from '@/components/ui/aurora-background';

export function HeroSection() {
  return (
    <AuroraBackground className="border-b border-border/40 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Top AI Badge Pill with Entrance Pulse */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-cyan-500/10"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide text-cyan-300 uppercase">
              Next-Gen AI Freelance Marketplace &amp; Workspace
            </span>
          </motion.div>

          {/* Headline Reveal */}
          <div className="max-w-5xl">
            <WordReveal
              text="Your Vision. Our Engineering. Global Impact."
              gradientWords={['Vision.', 'Engineering.', 'Impact.']}
              className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.08] text-foreground"
            />
          </div>

          {/* Defining Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-3xl text-balance text-base sm:text-xl leading-relaxed text-muted-foreground/90 font-normal"
          >
            We design, build, and scale{' '}
            <strong className="font-semibold text-foreground">secure web applications</strong>,{' '}
            <strong className="font-semibold text-foreground">mobile apps</strong>,{' '}
            <strong className="font-semibold text-foreground">AI solutions</strong>, and{' '}
            <strong className="font-semibold text-foreground">enterprise software</strong>{' '}
            that help businesses grow with confidence.
          </motion.p>

          {/* CTA Action Buttons with Magnetic Scaling */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto"
          >
            {/* Primary Glowing CTA */}
            <MagneticButton className="w-full sm:w-auto">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 opacity-75 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:blur-lg" aria-hidden="true" />
                <Button
                  asChild
                  size="lg"
                  className="relative h-14 w-full sm:w-auto px-8 text-base font-bold rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-2xl transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href="/post-a-job" className="flex items-center justify-center gap-2.5">
                    <span>Post Requirement</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </MagneticButton>

            {/* Secondary Glass CTA */}
            <MagneticButton className="w-full sm:w-auto">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full sm:w-auto px-8 text-base font-bold rounded-2xl border-white/20 bg-background/50 backdrop-blur-xl transition-all duration-300 hover:bg-accent/80 hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <Link href="/projects" className="flex items-center justify-center gap-2.5">
                  <Play className="h-4 w-4 text-cyan-400 fill-cyan-400/20" aria-hidden="true" />
                  <span>Explore Portfolio</span>
                </Link>
              </Button>
            </MagneticButton>
          </motion.div>

        </motion.div>
      </div>
    </AuroraBackground>
  );
}
