import Link from 'next/link';
import { Mail, Phone, Linkedin, Github, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';

export const revalidate = 3600;

export const metadata = {
  title: 'Our Team',
  description:
    'Meet our team of full-stack developers with expertise in web development, security engineering, and cloud DevOps.',
};

async function getMembers() {
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('display_order', { ascending: true });
  return (data as Member[]) ?? [];
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Our Team
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Skilled developers with proven track records building
              production-grade applications used by thousands of real users.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.slug}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {member.avatar_url && (
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold group-hover:text-primary">
                          {member.full_name}
                        </h2>
                        <p className="text-sm text-primary">{member.title}</p>
                        {member.location && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {member.location}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {member.skills.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-foreground"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-foreground"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-primary text-xs font-medium">
                        View profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
