'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Member } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

interface MembersClientProps {
  members: Member[];
}

export function MembersClient({ members }: MembersClientProps) {
  return (
    <motion.div
      variants={staggerContainer(0.12, 0.05)}
      initial="hidden"
      animate="show"
      className="grid gap-8 md:grid-cols-2"
    >
      {members.map((member, i) => (
        <motion.div key={member.id} variants={fadeIn('up', i * 0.08, 0.5)}>
          <Link href={`/members/${member.slug}`} className="group block h-full">
            <Card className="h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-7">
                <div className="flex items-start gap-5">
                  {member.avatar_url ? (
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40 bg-muted shadow-md group-hover:scale-105 transition-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar_url}
                        alt={member.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {member.full_name}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="h-3 w-3" />
                        Vetted Elite
                      </span>
                    </div>
                    <p className="text-xs font-bold text-primary tracking-wide uppercase mt-0.5">{member.title}</p>
                    {member.location && (
                      <p className="mt-1 text-xs text-muted-foreground font-medium">
                        📍 {member.location}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground border border-border/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {member.email && (
                      <span className="hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </span>
                    )}
                    {member.linkedin_url && (
                      <span className="hover:text-primary transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </span>
                    )}
                    {member.github_url && (
                      <span className="hover:text-primary transition-colors">
                        <Github className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-primary font-bold text-xs group-hover:translate-x-1 transition-transform">
                    View Profile Specs
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
