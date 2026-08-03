'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Eye, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Member } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

interface AboutPageClientProps {
  members: Member[];
}

const pillars = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To deliver reliable, scalable web applications that solve real problems for real users, while continuously growing as engineers.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'hover:border-cyan-500/50',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be a trusted development partner for clients worldwide, known for quality engineering, security, and dependable delivery.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'hover:border-indigo-500/50',
  },
  {
    icon: Award,
    title: 'Our Standards',
    description:
      'We follow industry best practices: secure authentication, optimized databases, CI/CD pipelines, and thorough testing across the full SDLC.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/50',
  },
];

const differentiators = [
  {
    num: '1',
    title: 'Real users, not just demos',
    desc: 'Our projects serve 5,000+ real users in production, handling concurrent load with sub-100ms API response times.',
  },
  {
    num: '2',
    title: 'Security-first approach',
    desc: 'From JWT authentication and RBAC to client-side encryption and Zero Trust IAM, security is built in, not bolted on.',
  },
  {
    num: '3',
    title: 'Full SDLC ownership',
    desc: 'We manage the complete lifecycle: system design, development, testing, deployment, and monitoring.',
  },
  {
    num: '4',
    title: 'Cloud-native deployment',
    desc: 'CI/CD pipelines, Docker containerization, and deployment on AWS, Azure, and Vercel for high availability.',
  },
];

export function AboutPageClient({ members }: AboutPageClientProps) {
  return (
    <>
      {/* Pillars */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {pillars.map((p, i) => (
              <motion.div key={p.title} variants={fadeIn('up', i * 0.1, 0.5)} whileHover={{ y: -6 }}>
                <Card className={`h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 ${p.border} hover:shadow-2xl`}>
                  <CardContent className="p-7">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.bg} ${p.color} shadow-md`}>
                      <p.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-border/40 bg-card/10 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">The People Behind the Code</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Engineers with complementary skills across full-stack development, security, and cloud DevOps.
            </p>
          </div>
          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 md:grid-cols-2"
          >
            {members.map((member, i) => (
              <motion.div key={member.id} variants={fadeIn('up', i * 0.1, 0.5)}>
                <Card className="h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
                  <CardContent className="p-7">
                    <div className="flex items-start gap-5">
                      {member.avatar_url && (
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/40 shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold">{member.full_name}</h3>
                        <p className="text-xs font-bold text-primary tracking-wide uppercase">{member.title}</p>
                        {member.location && (
                          <p className="text-xs text-muted-foreground mt-1">📍 {member.location}</p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-5 rounded-xl font-bold">
                      <Link href={`/members/${member.slug}`} className="flex items-center gap-1.5">
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What Sets Us Apart</h2>
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 sm:grid-cols-2"
          >
            {differentiators.map((d, i) => (
              <motion.div
                key={d.num}
                variants={fadeIn('up', i * 0.08, 0.4)}
                className="flex gap-4 rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-black">
                  {d.num}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{d.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
