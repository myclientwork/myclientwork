'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobRequest } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  QUALIFIED: 'bg-success/10 text-success',
  IN_PROGRESS: 'bg-primary/10 text-primary',
  COMPLETED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadJobs() {
      if (!user) return;
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setJobs((data as JobRequest[]) ?? []);
      setLoading(false);
    }
    loadJobs();
  }, [user]);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.service_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Requirements</h1>
          <p className="mt-1 text-muted-foreground">
            Track your submitted project requirements and their development status.
          </p>
        </div>
        <Button asChild>
          <Link href="/post-a-job">
            <Plus className="mr-2 h-4 w-4" />
            Post Requirement
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">
              {search ? 'No jobs match your search.' : 'No jobs submitted yet.'}
            </p>
            {!search && (
              <p className="mt-1 text-sm text-muted-foreground">
                Job requests submitted via the contact form will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {job.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{job.service_type}</span>
                        <span>·</span>
                        <span>
                          {job.currency} {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                          {' – '}
                          {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                        </span>
                        <span>·</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
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
    </div>
  );
}
