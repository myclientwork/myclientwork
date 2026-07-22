import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Shield,
  Rocket,
  Layers,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { ProjectWithMembers, Member } from '@/lib/types';

export const revalidate = 3600;

async function getHomeData() {
  const [projectsRes, membersRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, project_members(*, member:members(*))')
      .eq('status', 'PUBLISHED')
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .limit(3),
    supabase
      .from('members')
      .select('*')
      .order('display_order', { ascending: true }),
  ]);

  return {
    projects: (projectsRes.data as unknown as ProjectWithMembers[]) ?? [],
    members: (membersRes.data as Member[]) ?? [],
  };
}

const services = [
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Production-grade MERN and Next.js applications with secure authentication, REST APIs, and scalable architecture.',
  },
  {
    icon: Shield,
    title: 'Security Engineering',
    description:
      'Client-side encryption, Zero Trust IAM, RBAC, and formally validated security protocols for sensitive systems.',
  },
  {
    icon: Rocket,
    title: 'Cloud Deployment & DevOps',
    description:
      'CI/CD pipelines, Docker containerization, and cloud deployment on AWS, Azure, and Vercel with high availability.',
  },
  {
    icon: Layers,
    title: 'API & Backend Design',
    description:
      'RESTful APIs, microservices, database design with indexing and query optimization for sub-100ms response times.',
  },
];

const stats = [
  { value: '5,000+', label: 'Real Users Served' },
  { value: '5+', label: 'Production Projects' },
  { value: '3', label: 'Full-Stack Developers' },
  { value: '8.8', label: 'Average GPA' },
];

export default async function HomePage() {
  const { projects, members } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 animate-fade-in">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Full-Stack Development Team
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-up">
              We build{' '}
              <span className="text-primary">production-grade</span> web
              applications that scale
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Explore the work completed by our team, understand our
              capabilities, and post your project requirements to work with us.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg">
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What we do
            </h2>
            <p className="mt-4 text-muted-foreground">
              From idea to deployment, we handle the full lifecycle of modern
              web applications.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-y border-border/60 bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured work
              </h2>
              <p className="mt-4 text-muted-foreground">
                Real projects deployed and used by thousands of users.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/projects">
                All projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group"
              >
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
                    <Badge variant="secondary" className="mb-2">
                      {project.category}
                    </Badge>
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet the team
            </h2>
            <p className="mt-4 text-muted-foreground">
              Skilled developers with proven track records building real
              products.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.slug}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-6">
                    {member.avatar_url && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold group-hover:text-primary">
                        {member.full_name}
                      </h3>
                      <p className="text-sm text-primary">{member.title}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {member.bio}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-primary py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Looking for opportunities?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Browse our open job positions and apply online. Sign in to submit
            your application.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/jobs">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
