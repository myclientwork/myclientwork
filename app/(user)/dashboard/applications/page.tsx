'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Loader2 } from 'lucide-react';
import { UserBackLink } from '@/shared/components/layout/user-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobApplicationWithJob } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ACCEPTED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  WITHDRAWN: 'bg-secondary text-muted-foreground',
};

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('job_applications')
        .select('*, job_postings(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setApplications((data as unknown as JobApplicationWithJob[]) ?? []);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserBackLink />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Track the status of your job applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No applications yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse open positions and apply to get started.
            </p>
            <Button asChild className="mt-4">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link key={app.id} href={`/jobs/${app.job_postings.slug}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{app.job_postings.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {app.job_postings.category} · Applied on{' '}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {app.cover_letter}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_COLORS[app.status] || 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
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
