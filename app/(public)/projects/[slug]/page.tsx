import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Users,
  ArrowRight,
  Lightbulb,
  Wrench,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { ProjectWithMembers } from '@/lib/types';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug')
      .eq('status', 'PUBLISHED');
    return projects?.map((project) => ({
      slug: project.slug,
    })) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { data: project } = await supabase
    .from('projects')
    .select('title, seo_title, short_summary, seo_description, cover_image_url')
    .eq('slug', params.slug)
    .eq('status', 'PUBLISHED')
    .maybeSingle();

  if (!project) return { title: 'Project Not Found' };

  const title = project.seo_title || project.title;
  const description = project.seo_description || project.short_summary;
  const images = project.cover_image_url
    ? [{ url: project.cover_image_url, width: 1200, height: 630, alt: title }]
    : [];

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects/${params.slug}`,
      images,
    },
    twitter: {
      title,
      description,
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  };
}

async function getProject(slug: string) {
  const { data } = await supabase
    .from('projects')
    .select('*, project_members(*, member:members(*))')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .maybeSingle();
  return data as ProjectWithMembers | null;
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const members = project.project_members
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <article>
      {/* Hero */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{project.category}</Badge>
              {project.is_confidential && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                  <Lock className="h-3 w-3" />
                  Confidential
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {project.short_summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {project.completion_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.completion_date).toLocaleDateString(
                    'en-US',
                    { month: 'long', year: 'numeric' }
                  )}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {project.technologies.length} technologies
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {members.length} contributor{members.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {project.cover_image_url && (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="aspect-video overflow-hidden rounded-xl bg-muted shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {project.problem && (
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    The Problem
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <Wrench className="h-5 w-5 text-primary" />
                    The Solution
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}

              {project.outcome && (
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    The Outcome
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {project.outcome}
                  </p>
                </div>
              )}

              {project.body && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold">Project Details</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.body}
                  </p>
                </div>
              )}

              {project.demo_url && (
                <Button asChild>
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold">Technologies</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {members.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">Team Contributions</h3>
                    <div className="mt-4 space-y-4">
                      {members.map((pm) => (
                        <Link
                          key={pm.id}
                          href={`/members/${pm.member.slug}`}
                          className="flex items-start gap-3 group"
                        >
                          {pm.member.avatar_url && (
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={pm.member.avatar_url}
                                alt={pm.member.full_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary">
                              {pm.member.full_name}
                            </p>
                            <p className="text-xs text-primary">
                              {pm.role_on_project}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {pm.contribution}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-primary-foreground">
                    Want something similar?
                  </h3>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Post your project requirements and we&apos;ll build it for
                    you.
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    <Link href={`/contact?subject=Project%20Inquiry%3A%20${project.slug}`}>
                      Request a similar project
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
