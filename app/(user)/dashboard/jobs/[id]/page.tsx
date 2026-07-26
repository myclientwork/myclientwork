'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, User, Mail, Phone, Building2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { JobRequest } from '@/lib/types';

const STATUS_FLOW = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'CLARIFICATION_REQUIRED',
  'QUALIFIED',
  'QUOTE_SENT',
  'ACCEPTED',
  'IN_PROGRESS',
  'CLIENT_REVIEW',
  'COMPLETED',
];

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<JobRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setJob(data as JobRequest | null);
      setLoading(false);
    }
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    );
  }

  if (!job) return notFound();

  const currentStepIndex = STATUS_FLOW.indexOf(job.status);
  const isTerminal = !STATUS_FLOW.includes(job.status);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <p className="mt-1 text-muted-foreground">{job.service_type}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {job.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Status timeline */}
      {!isTerminal && currentStepIndex >= 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {STATUS_FLOW.map((status, i) => (
                <div key={status} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`h-0.5 w-8 ${i < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Current step: {job.status.replace(/_/g, ' ')}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.currency}{' '}
                  {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                  {' – '}
                  {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Flexibility</p>
                <p className="mt-1 text-sm text-muted-foreground capitalize">{job.flexibility || 'Not specified'}</p>
              </div>
              {job.preferred_start_date && (
                <div>
                  <p className="text-sm font-medium">Preferred Start</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(job.preferred_start_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {job.target_completion_date && (
                <div>
                  <p className="text-sm font-medium">Target Completion</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(job.target_completion_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            {job.source_project_slug && (
              <div>
                <p className="text-sm font-medium">Source Project</p>
                <Link href={`/projects/${job.source_project_slug}`} className="text-sm text-primary hover:underline">
                  View reference project
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{job.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{job.email}</span>
            </div>
            {job.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{job.company}</span>
              </div>
            )}
            {job.country && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{job.country}</span>
              </div>
            )}
            {job.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{job.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">Contact via: {job.preferred_contact_method}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Submitted on {new Date(job.created_at).toLocaleString()}
      </p>
    </div>
  );
}
