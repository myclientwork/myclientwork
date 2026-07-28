'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { JobPosting } from '@/lib/types';

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  any: 'Any Level',
};

function JobsContent() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('job_postings')
        .select(
          'id, title, slug, category, description, experience_level, technologies, location, remote_ok, budget_min_cents, budget_max_cents, currency, deadline'
        )
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });
      setJobs((data as JobPosting[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Open Requirements &amp; Positions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore open project scopes and engineering positions. Have a custom web or mobile app in mind?
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href="/post-a-job">
                  Post Your Project Requirement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 w-20 rounded bg-muted" />
                      <div className="h-5 w-3/4 rounded bg-muted" />
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center p-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium">No open positions right now.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check back soon for new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.slug}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {job.category}
                          </Badge>
                          <h3 className="font-semibold leading-tight group-hover:text-primary">
                            {job.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary whitespace-nowrap">
                          {EXPERIENCE_LABELS[job.experience_level] || job.experience_level}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                        )}
                        {job.remote_ok && (
                          <span className="flex items-center gap-1 text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Remote OK
                          </span>
                        )}
                        {job.budget_min_cents && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {job.currency} {(job.budget_min_cents / 100).toLocaleString()}
                            {job.budget_max_cents && ` – ${(job.budget_max_cents / 100).toLocaleString()}`}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                        View &amp; Apply
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function JobsPage() {
  return <JobsContent />;
}
