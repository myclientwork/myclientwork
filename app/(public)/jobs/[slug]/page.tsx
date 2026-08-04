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
import { ApplyForm } from '@/features/jobs/components/apply-form';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import type { JobPosting } from '@/lib/types';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: { slug: string } };

function toCleanSlug(rawSlug: string): string {
  return rawSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
}

async function getJob(slugParam: string) {
  const decoded = decodeURIComponent(slugParam).trim();
  const clean = toCleanSlug(decoded);
  const unhyphenated = decoded.replace(/-/g, ' ');

  const { data: jobs } = await supabase
    .from('job_postings')
    .select(
      'id, slug, title, description, category, technologies, experience_level, location, remote_ok, budget_min_cents, budget_max_cents, currency, deadline, status'
    )
    .eq('status', 'PUBLISHED');

  if (!jobs || jobs.length === 0) return null;

  const match = jobs.find(
    (j) =>
      j.slug === decoded ||
      j.slug === slugParam ||
      (j.slug && toCleanSlug(j.slug) === clean) ||
      (j.title && j.title.toLowerCase() === decoded.toLowerCase()) ||
      (j.slug && j.slug.toLowerCase() === unhyphenated.toLowerCase())
  );

  return (match as JobPosting) || null;
}

export async function generateStaticParams() {
  try {
    const { data: jobs } = await supabase
      .from('job_postings')
      .select('slug')
      .eq('status', 'PUBLISHED');

    return (
      jobs
        ?.map((j) => ({ slug: toCleanSlug(j.slug) }))
        .filter((item): item is { slug: string } => Boolean(item.slug)) ?? []
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const job = await getJob(params.slug);

  if (!job) return { title: 'Job Not Found' };

  const description = job.description.slice(0, 160);
  const cleanSlug = toCleanSlug(job.slug || params.slug);

  return {
    title: job.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/jobs/${cleanSlug}`,
    },
    openGraph: {
      title: job.title,
      description,
      url: `${SITE_URL}/jobs/${cleanSlug}`,
    },
    twitter: {
      title: job.title,
      description,
    },
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

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.slug);
  if (!job) notFound();

  return (
    <AuthGuard>
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
              <ApplyForm job={job} />
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
