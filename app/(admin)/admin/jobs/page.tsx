'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Search, Briefcase, ExternalLink, Loader2 } from 'lucide-react';
import { AdminBackLink } from '@/shared/components/layout/admin-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import type { JobRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  UNDER_REVIEW: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  QUALIFIED: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/20',
  COMPLETED: 'bg-success/10 text-success border-success/20',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/20',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
};

const JOB_STATUS_OPTIONS = [
  'UNDER_REVIEW',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
];

const FILTER_STATUSES = ['ALL', 'SUBMITTED', ...JOB_STATUS_OPTIONS, 'REJECTED', 'CANCELLED'];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setJobs((data as JobRequest[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleStatusChange(job: JobRequest, newStatus: string) {
    if (job.status === newStatus) return;

    setUpdatingId(job.id);
    const previousStatus = job.status;

    // 1. Optimistic UI update
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );

    try {
      // 2. Immediate DB update
      const { error } = await supabase
        .from('job_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', job.id);

      if (error) throw error;

      // 3. Trigger Nodemailer email via API endpoint
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

      if (emailRes.ok && emailResult.success) {
        toast.success(
          `Status updated to "${newStatus.replace(/_/g, ' ')}"`,
          {
            description: emailResult.emailSent
              ? `Client notification email sent via Nodemailer to ${job.email}`
              : `Status updated in database`,
          }
        );
      } else {
        toast.success(`Status updated to "${newStatus.replace(/_/g, ' ')}"`);
      }
    } catch (err: any) {
      // Rollback on failure
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === job.id ? { ...j, status: previousStatus } : j))
      );
      toast.error('Failed to update status', {
        description: err.message || 'Please check database permissions',
      });
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <AdminBackLink />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Requirements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage project requirements, change status inline, and auto-notify clients via Nodemailer.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, client name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading requirements...
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No requirements found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  {/* Left info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="font-semibold text-foreground hover:text-primary hover:underline"
                      >
                        {job.title}
                      </Link>
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="text-muted-foreground hover:text-foreground"
                        title="View details"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{job.name}</span> · {job.email} ·{' '}
                      <span className="capitalize">{job.service_type}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Budget: {job.currency}{' '}
                        {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                        {' – '}
                        {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                      </span>
                      <span>·</span>
                      <span>Submitted: {new Date(job.created_at).toLocaleDateString()}</span>
                      {job.source_project_slug && (
                        <>
                          <span>·</span>
                          <span className="text-primary">Ref: {job.source_project_slug}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Status Controls */}
                  <div className="flex flex-wrap items-center gap-3 border-t pt-3 md:border-t-0 md:pt-0">
                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-xs font-semibold ${
                        STATUS_COLORS[job.status] || 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {job.status.replace(/_/g, ' ')}
                    </Badge>

                    {/* Inline Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <Select
                        value={job.status}
                        onValueChange={(val) => handleStatusChange(job, val)}
                        disabled={updatingId === job.id}
                      >
                        <SelectTrigger className="h-9 w-40 text-xs">
                          <SelectValue placeholder="Change status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set([job.status, ...JOB_STATUS_OPTIONS])).map((statusOption) => (
                            <SelectItem key={statusOption} value={statusOption} className="text-xs">
                              {statusOption.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingId === job.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
