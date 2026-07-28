import Link from 'next/link';
import { Target, Eye, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';

export const revalidate = 60;

async function getMembers() {
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('display_order', { ascending: true });
  return (data as Member[]) ?? [];
}

export const metadata = {
  title: 'About Us',
  description:
    'Learn about our team of full-stack developers and our mission to build production-grade web applications.',
};

export default async function AboutPage() {
  const members = await getMembers();

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About MyClientWork
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We are a team of full-stack developers from KIIT University with
              hands-on experience building production-grade web applications
              used by thousands of real users. Our mission is to turn ideas into
              clean, working products.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">Our Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  To deliver reliable, scalable web applications that solve real
                  problems for real users, while continuously growing as
                  engineers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">Our Vision</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  To be a trusted development partner for clients worldwide,
                  known for quality engineering, security, and dependable
                  delivery.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">Our Standards</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We follow industry best practices: secure authentication,
                  optimized databases, CI/CD pipelines, and thorough testing
                  across the full SDLC.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Users className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              The people behind the work
            </h2>
            <p className="mt-4 text-muted-foreground">
              Two developers with complementary skills across full-stack
              development, security, and cloud DevOps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
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
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.full_name}</h3>
                      <p className="text-sm text-primary">{member.title}</p>
                      {member.location && (
                        <p className="text-sm text-muted-foreground">
                          {member.location}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href={`/members/${member.slug}`}>
                      View profile
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            What sets us apart
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">Real users, not just demos</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our projects serve 5,000+ real users in production, handling
                  concurrent load with sub-100ms API response times.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">Security-first approach</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  From JWT authentication and RBAC to client-side encryption and
                  Zero Trust IAM, security is built in, not bolted on.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">Full SDLC ownership</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We manage the complete lifecycle: system design, development,
                  testing, deployment, and monitoring.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-medium">Cloud-native deployment</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  CI/CD pipelines, Docker containerization, and deployment on
                  AWS, Azure, and Vercel for high availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
