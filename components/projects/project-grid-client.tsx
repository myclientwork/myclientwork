'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Code2, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

interface ProjectGridClientProps {
  projects: Project[];
  categories: string[];
}

export function ProjectGridClient({ projects, categories }: ProjectGridClientProps) {
  return (
    <div className="space-y-16">
      {categories.map((category) => (
        <div key={category} className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{category}</h2>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <motion.div
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects
              .filter((p) => p.category === category)
              .map((project, i) => (
                <motion.div key={project.id} variants={fadeIn('up', i * 0.05, 0.4)}>
                  <Link href={`/projects/${project.slug}`} className="group block h-full">
                    <Card className="h-full overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                      {project.cover_image_url ? (
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                          <div className="absolute top-3 right-3 rounded-full bg-slate-950/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-md">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-primary/5 text-primary">
                          <Code2 className="h-10 w-10" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge variant="secondary" className="text-[10px] font-extrabold tracking-wider uppercase bg-primary/10 text-primary">
                            {project.category}
                          </Badge>
                          {project.is_confidential && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                              <Lock className="h-3 w-3" />
                              Confidential
                            </span>
                          )}
                        </div>
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
                        {project.completion_date && (
                          <p className="mt-4 text-[11px] font-medium text-muted-foreground">
                            Delivered{' '}
                            {new Date(project.completion_date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
