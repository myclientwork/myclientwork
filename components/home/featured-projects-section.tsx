'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { ProjectWithMembers } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { ProjectCardImage } from './project-card-image';

interface FeaturedProjectsSectionProps {
  projects: ProjectWithMembers[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <section className="relative border-y border-border/40 bg-card/10 py-24 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="outline" className="mb-3 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
              Proven Portfolio
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Featured Client Solutions
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Production software delivered with ultra-fast sub-50ms latency and high satisfaction.
            </p>
          </div>
          <Button asChild variant="ghost" className="group rounded-xl hover:bg-accent">
            <Link href="/projects" className="flex items-center gap-1.5 font-bold text-primary">
              <span>View All Projects</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <motion.div key={project.id} variants={fadeIn('up', i * 0.1, 0.5)}>
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                    <ProjectCardImage project={project} />
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3 text-[10px] font-extrabold tracking-widest uppercase bg-primary/10 text-primary">
                        {project.category}
                      </Badge>
                      <h3 className="text-xl font-bold leading-tight transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {project.short_summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground border border-border/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <Code2 className="mx-auto h-12 w-12 text-muted-foreground/40 animate-pulse" />
              <p className="mt-3 text-sm font-semibold">Featured client projects will be displayed here soon.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
