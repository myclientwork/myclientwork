import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ProjectGridClient } from '@/components/projects/project-grid-client';
import { createPageMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Browse our portfolio of production-grade web applications, SaaS platforms, security research, and full-stack engineering projects delivered by MyClientWork.',
  path: '/projects',
});

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('id, title, slug, category, short_summary, cover_image_url, technologies, completion_date, is_confidential')
    .eq('status', 'PUBLISHED')
    .order('display_order', { ascending: true });
  return (data as Project[]) ?? [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Client Portfolio
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl text-foreground">
              Production Client Solutions
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Real software built and deployed by our engineering team, serving critical workflows with guaranteed sub-50ms speed.
            </p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectGridClient projects={projects} categories={categories} />
        </div>
      </section>
    </div>
  );
}
