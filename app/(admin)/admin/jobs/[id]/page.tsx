'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, Building2, Globe, DollarSign, Calendar } from 'lucide-react';
import { AdminBackLink } from '@/shared/components/layout/admin-back-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { JobRequest } from '@/lib/types';

const JOB_STATUSES = [
  'UNDER_REVIEW',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
];

export default function AdminJobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<JobRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setJob(data as JobRequest | null);
      setLoading(false);
    }
    load();
  }, [id]);

  async function updateStatus(newStatus: string) {
    if (!job || job.status === newStatus) return;
    setUpdating(true);
    const previousStatus = job.status;
    setJob({ ...job, status: newStatus });

    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', job.id);
      if (error) throw error;

      const emailRes = await fetch('/api/admin/job-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          status: newStatus,
          clientEmail: job.email,
          clientName: job.name,
          jobTitle: job.title,
        }),
      });

      const emailResult = await emailRes.json();
      toast.success(
        `Status updated to "${newStatus.replace(/_/g, ' ')}"`,
        {
          description: emailResult?.emailSent
            ? `Client notification email sent via Nodemailer to ${job.email}`
            : `Status updated in database`,
        }
      );
    } catch {
      setJob({ ...job, status: previousStatus });
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>;
  }
  if (!job) return notFound();

  return (
    <div className="space-y-6">
      <AdminBackLink />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-1 text-muted-foreground">{job.service_type}</p>
        </div>
        <Badge variant="secondary" className="text-sm">{job.status.replace(/_/g, ' ')}</Badge>
      </div>

      {/* Status control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Select value={job.status} onValueChange={updateStatus} disabled={updating}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set([job.status, ...JOB_STATUSES])).map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {updating && <span className="text-sm text-muted-foreground">Updating...</span>}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.currency} {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                  {' – '}{job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Flexibility</p>
                <p className="mt-1 text-sm text-muted-foreground capitalize">{job.flexibility || 'N/A'}</p>
              </div>
              {job.preferred_start_date && (
                <div>
                  <p className="text-sm font-medium">Preferred Start</p>
                  <p className="mt-1 text-sm text-muted-foreground">{new Date(job.preferred_start_date).toLocaleDateString()}</p>
                </div>
              )}
              {job.target_completion_date && (
                <div>
                  <p className="text-sm font-medium">Target Completion</p>
                  <p className="mt-1 text-sm text-muted-foreground">{new Date(job.target_completion_date).toLocaleDateString()}</p>
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
          <CardHeader><CardTitle className="text-base">Client Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /> {job.name}</div>
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {job.email}</div>
            {job.company && <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-muted-foreground" /> {job.company}</div>}
            {job.country && <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-muted-foreground" /> {job.country}</div>}
            {job.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {job.phone}</div>}
            <div className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-muted-foreground" /> Contact via: {job.preferred_contact_method}</div>
            <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /> Submitted: {new Date(job.created_at).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
