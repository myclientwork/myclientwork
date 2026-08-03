'use client';

import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Zap, ShieldCheck, Cpu, ArrowUpRight, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroWidgets() {
  return (
    <div className="relative mt-12 w-full max-w-5xl mx-auto">
      {/* Central Interactive Preview Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 p-4 sm:p-8 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Ambient Top Light Strip */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

        {/* Dashboard Header Simulator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 pl-2">myclientwork.online/ai-workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-[10px] gap-1 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              AI Engine Active
            </Badge>
          </div>
        </div>

        {/* Floating Interactive Widget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Talent Matcher */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">AI Talent Matcher</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
                98.4% Match
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Analyzed project specs: Full-Stack Next.js, Sub-50ms API &amp; Auth.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] rounded-md bg-indigo-500/20 text-indigo-300 px-2 py-0.5 font-medium">Next.js 14</span>
              <span className="text-[10px] rounded-md bg-purple-500/20 text-purple-300 px-2 py-0.5 font-medium">Tailwind</span>
              <span className="text-[10px] rounded-md bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-medium">Supabase</span>
            </div>
          </motion.div>

          {/* Card 2: Live Project Velocity */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">Sprint Velocity</span>
              </div>
              <span className="text-xs font-bold text-indigo-400">88% Completed</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '88%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Builds</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> 60 FPS Smooth
              </span>
            </div>
          </motion.div>

          {/* Card 3: Smart Escrow & QA */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">Milestone Protection</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Protected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              Automated AI verification and encrypted client collaboration.
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Milestone status:</span>
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                Phase 2 Delivered <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
