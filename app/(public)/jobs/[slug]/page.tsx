import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { LazyApplyForm } from '@/features/jobs/components/lazy-apply-form';
import type { JobPosting } from '@/lib/types';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const { data: jobs } = await supabase
      .from('job_postings')
      .select('slug')
      .eq('status', 'PUBLISHED');
    return jobs?.map((j) => ({ slug: j.slug })) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: job } = await supabase
    .from('job_postings')
    .select('title, description')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .maybeSingle();

  if (!job) return { title: 'Job Not Found' };

  return {
    title: job.title,
    description: job.description.slice(0, 160),
  };
}

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  secondary: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  any: 'Any Level',
};

async function getJob(slug: string) {
  const { data } = await supabase
    .from('job_postings')
    .select(
      'id, slug, title, description, category, technologies, experience_level, location, remote_ok, budget_min_cents, budget_max_cents, currency, deadline, status'
    )
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .maybeSingle();
  return data as JobPosting | null;
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All jobs
          </Link>
          <div className="mt-6">
            <Badge variant="secondary">{job.category}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {EXPERIENCE_LABELS[job.experience_level] || job.experience_level}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              )}
              {job.remote_ok && (
                <span className="flex items-center gap-1.5 text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Remote OK
                </span>
              )}
              {job.budget_min_cents && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  {job.currency} {(job.budget_min_cents / 100).toLocaleString()}
                  {job.budget_max_cents && ` – ${(job.budget_max_cents / 100).toLocaleString()}`}
                </span>
              )}
              {job.deadline && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold">Job Description</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {job.description}
              </p>

              {job.technologies.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold">Required Technologies</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Interactive form client component side */}
            <div className="space-y-4">
              <LazyApplyForm job={job} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
