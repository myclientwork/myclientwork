import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Award,
  Trophy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Member, ProjectWithMembers } from '@/lib/types';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const { data: members } = await supabase
      .from('members')
      .select('slug');
    return members?.map((m) => ({ slug: m.slug })) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { data: member } = await supabase
    .from('members')
    .select('full_name, title, bio')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!member) return { title: 'Member Not Found' };

  return {
    title: `${member.full_name} — ${member.title}`,
    description: member.bio.slice(0, 160),
  };
}

async function getMember(slug: string) {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data as Member | null;
}

async function getMemberProjects(memberId: string) {
  const { data } = await supabase
    .from('projects')
    .select('*, project_members!inner(*, member:members(*))')
    .eq('status', 'PUBLISHED')
    .eq('project_members.member_id', memberId)
    .order('display_order', { ascending: true });
  return (data as unknown as ProjectWithMembers[]) ?? [];
}

export default async function MemberProfilePage({ params }: Props) {
  const member = await getMember(params.slug);
  if (!member) notFound();

  const projects = await getMemberProjects(member.id);

  return (
    <article>
      {/* Hero */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All team members
          </Link>
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
            {member.avatar_url ? (
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md ring-2 ring-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar_url}
                  alt={member.full_name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-3xl shadow-md">
                {member.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {member.full_name}
              </h1>
              <p className="mt-1 text-lg text-primary">{member.title}</p>
              {member.location && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </a>
                )}
              </div>
              <div className="mt-3 flex gap-3">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {member.portfolio_url && (
                  <a
                    href={member.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div>
                <h2 className="text-xl font-semibold">About</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
                {member.experience_summary && (
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {member.experience_summary}
                  </p>
                )}
              </div>

              {/* Projects */}
              {projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <div className="mt-4 space-y-4">
                    {projects.map((project) => {
                      const pm = project.project_members.find(
                        (m) => m.member_id === member.id
                      );
                      return (
                        <Link
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          className="group block"
                        >
                          <Card className="transition-all hover:shadow-md">
                            <CardContent className="flex items-start gap-4 p-4">
                              {project.cover_image_url && (
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={project.cover_image_url}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-medium group-hover:text-primary">
                                  {project.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                  {project.short_summary}
                                </p>
                                {pm && (
                                  <p className="mt-2 text-xs text-primary">
                                    Role: {pm.role_on_project}
                                  </p>
                                )}
                              </div>
                              <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              {member.certifications.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Award className="h-4 w-4 text-primary" />
                      Certifications
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {member.certifications.map((cert) => (
                        <li
                          key={cert}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              {member.achievements.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Trophy className="h-4 w-4 text-primary" />
                      Achievements
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {member.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-primary-foreground">
                    Work with {member.full_name.split(' ')[0]}
                  </h3>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Have a project that fits these skills? Post your
                    requirements.
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    <Link href="/contact">Get Started</Link>
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
