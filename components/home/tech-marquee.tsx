'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Rocket,
  Shield,
  Zap,
  Sparkles,
  Server,
  Cloud,
  Terminal,
} from 'lucide-react';

const techItems = [
  { name: 'Next.js 14', icon: Code2, color: 'text-cyan-400' },
  { name: 'React 18', icon: Zap, color: 'text-sky-400' },
  { name: 'TypeScript', icon: Terminal, color: 'text-blue-400' },
  { name: 'Tailwind CSS', icon: Layers, color: 'text-indigo-400' },
  { name: 'Supabase DB', icon: Database, color: 'text-emerald-400' },
  { name: 'AI Workflows', icon: Cpu, color: 'text-purple-400' },
  { name: 'Cloud DevOps', icon: Cloud, color: 'text-pink-400' },
  { name: 'Zero Trust IAM', icon: Shield, color: 'text-amber-400' },
  { name: 'Fast REST/GraphQL', icon: Server, color: 'text-cyan-400' },
  { name: 'Docker Containers', icon: Rocket, color: 'text-indigo-400' },
];

export function TechMarquee() {
  const marqueeItems = [...techItems, ...techItems, ...techItems];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-slate-950/60 py-6 backdrop-blur-xl">
      {/* Gradient Fades for Seamless Marquee Edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center gap-8 w-max"
      >
        {marqueeItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-white/10"
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-xs font-bold text-slate-200 tracking-wide">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
