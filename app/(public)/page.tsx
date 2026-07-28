import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Shield,
  Rocket,
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Users,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { ProjectWithMembers, Member } from '@/lib/types';

export const revalidate = 60;

async function getHomeData() {
  try {
    const [projectsRes, membersRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, slug, category, short_summary, cover_image_url, technologies')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .order('display_order', { ascending: true })
        .limit(3),
      supabase
        .from('members')
        .select('id, full_name, slug, title, bio, avatar_url, skills')
        .order('display_order', { ascending: true }),
    ]);

    return {
      projects: (projectsRes.data as unknown as ProjectWithMembers[]) ?? [],
      members: (membersRes.data as Member[]) ?? [],
    };
  } catch {
    return { projects: [], members: [] };
  }
}

const services = [
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Production-grade Next.js & MERN applications with ultra-fast rendering, seamless auth, and bulletproof security.',
    gradient: 'from-blue-500/10 via-indigo-500/10 to-transparent',
    iconColor: 'text-blue-500',
  },
  {
    icon: Shield,
    title: 'Security Engineering',
    description:
      'Client-side encryption, Zero Trust IAM, granular RBAC, and formally audited protocols for critical enterprise systems.',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-transparent',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Rocket,
    title: 'Cloud Deployment & DevOps',
    description:
      'Automated CI/CD pipelines, Docker containerization, and auto-scaling cloud deployments on AWS & Vercel.',
    gradient: 'from-purple-500/10 via-pink-500/10 to-transparent',
    iconColor: 'text-purple-500',
  },
  {
    icon: Layers,
    title: 'API & Microservices Architecture',
    description:
      'High-throughput RESTful & GraphQL APIs, optimized database indexing, and sub-50ms response times at scale.',
    gradient: 'from-amber-500/10 via-orange-500/10 to-transparent',
    iconColor: 'text-amber-500',
  },
];

const stats = [
  { value: '5,000+', label: 'Active End Users', icon: Users },
  { value: '99.9%', label: 'Uptime & Reliability', icon: Zap },
  { value: '10+', label: 'Production Apps Delivered', icon: Globe },
  { value: '4.9/5', label: 'Client Satisfaction Score', icon: Star },
];

export default async function HomePage() {
  const { projects, members } = await getHomeData();

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Glow Orbs background effect */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/10 to-purple-500/20 blur-3xl opacity-70" />

      {/* Hero Section */}
      <section className="relative border-b border-border/40 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            {/* Hero Heading */}
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              We Build <span className="bg-gradient-to-r from-primary via-sky-500 to-indigo-600 bg-clip-text text-transparent">Production-Grade</span> Apps That Scale Effortlessly
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              Turn your complex project requirements into elegant, resilient, and ultra-fast web &amp; mobile applications. Explore our portfolio or post your custom requirement today.
            </p>

            {/* Hero Actions */}
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                <Link href="/post-a-job">
                  Post Requirement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-border/80 backdrop-blur-sm transition-all hover:bg-accent">
                <Link href="/projects">View Our Work</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-b border-border/40 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Our Core Expertise</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              End-to-End Development Capabilities
            </h2>
            <p className="mt-4 text-muted-foreground">
              From design architecture to continuous deployment, we bring modern engineering practices to every client project.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group relative overflow-hidden border-border/60 bg-gradient-to-b from-card to-background transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                <CardContent className="relative p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border/80 shadow-sm transition-colors ${service.iconColor}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">{service.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="border-y border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="mb-3">Portfolio</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured Client Projects
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real software solutions built and launched for businesses around the world.
              </p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link href="/projects" className="flex items-center gap-1 font-semibold text-primary">
                Explore All Projects
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl">
                    {project.cover_image_url ? (
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-primary/5 text-primary">
                        <Code2 className="h-12 w-12" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3 text-[10px] font-semibold tracking-wide uppercase">
                        {project.category}
                      </Badge>
                      <h3 className="text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {project.short_summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Code2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium">Projects ready to showcase soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Expert Team</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineers Working On Your Vision
            </h2>
            <p className="mt-4 text-muted-foreground">
              Passionate full-stack developers committed to high performance and clean architecture.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.slug}`}
                className="group"
              >
                <Card className="h-full border-border/60 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="flex items-start gap-5 p-6 sm:p-8">
                    {member.avatar_url ? (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                        {member.full_name}
                      </h3>
                      <p className="text-xs font-semibold text-primary">{member.title}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground"
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

      {/* Premium CTA Banner */}
      <section className="relative overflow-hidden border-t border-border/40 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-600 to-primary opacity-95" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Have a Project Requirement in Mind?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/90 leading-relaxed">
            Submit your specs in under 3 minutes. Our engineering team will analyze your requirements, estimate timelines, and provide a clear execution roadmap.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base shadow-lg transition-transform hover:scale-[1.02]">
              <Link href="/post-a-job">
                Submit Project Specs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

