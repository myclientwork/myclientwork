'use client';

import { motion } from 'framer-motion';
import { Code2, Shield, Rocket, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { fadeIn, staggerContainer } from '@/lib/motion';

const services = [
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Production-grade Next.js & MERN applications with ultra-fast rendering, seamless auth, and bulletproof security.',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/40',
  },
  {
    icon: Shield,
    title: 'Security Engineering',
    description:
      'Client-side encryption, Zero Trust IAM, granular RBAC, and formally audited protocols for critical enterprise systems.',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/40',
  },
  {
    icon: Rocket,
    title: 'Cloud Deployment & DevOps',
    description:
      'Automated CI/CD pipelines, Docker containerization, and auto-scaling cloud deployments on AWS & Vercel.',
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/40',
  },
  {
    icon: Layers,
    title: 'API & Microservices Architecture',
    description:
      'High-throughput RESTful & GraphQL APIs, optimized database indexing, and sub-50ms response times at scale.',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    iconColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/40',
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
            Our Core Capabilities
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            End-to-End AI Engineering
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            From design architecture to continuous deployment, we bring modern engineering practices and AI optimization to every client project.
          </p>
        </div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={fadeIn('up', i * 0.1, 0.5)}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className={`group relative h-full overflow-hidden rounded-2xl border-border/60 bg-gradient-to-b from-card to-background/80 backdrop-blur-xl transition-all duration-300 ${service.borderColor} hover:shadow-2xl hover:shadow-primary/5`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <CardContent className="relative p-7 flex flex-col h-full">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border/80 shadow-md transition-transform duration-300 group-hover:scale-110 ${service.iconColor}`}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold leading-tight">{service.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground flex-1">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
