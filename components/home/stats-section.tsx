'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Globe, Star } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/motion';

const stats = [
  { value: '5,000+', label: 'Active End Users', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { value: '99.9%', label: 'Uptime & Reliability', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { value: '10+', label: 'Production Apps Delivered', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { value: '4.9/5', label: 'Client Satisfaction Score', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export function StatsSection() {
  return (
    <section className="relative border-b border-border/40 bg-card/20 py-14 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeIn('up', i * 0.1, 0.5)}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs font-semibold text-muted-foreground tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
