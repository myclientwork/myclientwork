'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Member } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

interface TeamSectionProps {
  members: Member[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3 border-purple-500/30 bg-purple-500/10 text-purple-400 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
            Elite Vetted Engineers
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Vetted Talent For Your Vision
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Top 1% full-stack engineers and AI specialists ready to build your custom web apps.
          </p>
        </div>

        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid gap-8 md:grid-cols-2"
        >
          {members.map((member, i) => (
            <motion.div key={member.id} variants={fadeIn('up', i * 0.1, 0.5)}>
              <Link href={`/members/${member.slug}`} className="group block">
                <Card className="h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl">
                  <CardContent className="flex items-start gap-5 p-6 sm:p-8">
                    {member.avatar_url ? (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40 bg-muted shadow-md group-hover:scale-105 transition-transform">
                        <Image
                          src={member.avatar_url}
                          alt={member.full_name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                        {member.full_name}
                      </h3>
                      <p className="text-xs font-bold text-primary tracking-wide uppercase mt-0.5">{member.title}</p>
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground border border-border/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
