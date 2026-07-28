'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DataPagination } from '@/components/data-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
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
  SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  QUALIFIED: 'bg-success/10 text-success',
  IN_PROGRESS: 'bg-primary/10 text-primary',
  COMPLETED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

const STATUSES = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'QUALIFIED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'];
const PAGE_SIZE = 10;

function sanitizeSearchTerm(value: string) {
  return value.trim().replace(/[%_,().]/g, ' ');
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedSearch = useDebouncedValue(search);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const normalizedSearch = sanitizeSearchTerm(debouncedSearch);

    let query = supabase
      .from('job_requests')
      .select('*', { count: 'exact' });

    if (statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    if (normalizedSearch) {
      query = query.or(
        `title.ilike.%${normalizedSearch}%,name.ilike.%${normalizedSearch}%,email.ilike.%${normalizedSearch}%`
      );
    }

    const { data, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    setJobs((data as JobRequest[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [debouncedSearch, page, statusFilter]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Client Requirements</h1>
        <p className="mt-1 text-muted-foreground">Review and manage all submitted client project requirements.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, name, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading requirements">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-80 max-w-full" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No jobs found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/admin/jobs/${job.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.name} · {job.email} · {job.service_type}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          {job.currency}{' '}
                          {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                          {' – '}
                          {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                        </span>
                        <span>·</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        {job.source_project_slug && (
                          <>
                            <span>·</span>
                            <span className="text-primary">From: {job.source_project_slug}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[job.status] || 'bg-secondary text-muted-foreground'}`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <DataPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
