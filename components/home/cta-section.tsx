'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      {/* Background Gradient & Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-950 to-slate-950 opacity-95" />
      <div className="pointer-events-none absolute inset-0 bg-grid-mask opacity-30" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-purple-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-cyan-300 uppercase">
              Start Your AI Project Today
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
            Have a Project Requirement in Mind?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 leading-relaxed font-normal">
            Submit your specs in under 3 minutes. Our engineering team will analyze your requirements, estimate timelines, and provide a clear execution roadmap.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-bold rounded-2xl bg-white text-slate-950 shadow-2xl hover:bg-slate-100 hover:scale-105 transition-all duration-300"
              >
                <Link href="/post-a-job" className="flex items-center justify-center gap-2">
                  <span>Submit Project Specs</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-bold rounded-2xl border-white/30 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
