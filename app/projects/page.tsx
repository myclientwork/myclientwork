import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects',
  description:
    'Browse our portfolio of production-grade web applications, security research, and full-stack projects.',
};

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('display_order', { ascending: true });
  return (data as Project[]) ?? [];
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
        {project.cover_image_url && (
          <div className="aspect-video overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            {project.is_confidential && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                <Lock className="h-3 w-3" />
                Confidential
              </span>
            )}
          </div>
          <h3 className="font-semibold leading-tight group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.short_summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.completion_date && (
            <p className="mt-3 text-xs text-muted-foreground">
              Completed{' '}
              {new Date(project.completion_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Our Projects
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Real applications built and deployed by our team, serving
              thousands of users in production.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="mb-6 text-xl font-semibold">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects
                  .filter((p) => p.category === category)
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
