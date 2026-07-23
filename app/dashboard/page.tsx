'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobRequest } from '@/lib/types';

export default function DashboardOverviewPage() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      if (!user) return;
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setJobs((data as JobRequest[]) ?? []);
      setLoading(false);
    }
    loadJobs();
  }, [user]);

  const stats = [
    {
      label: 'Total Jobs',
      value: jobs.length,
      icon: Briefcase,
      color: 'text-primary',
    },
    {
      label: 'Active',
      value: jobs.filter((j) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(j.status)).length,
      icon: Clock,
      color: 'text-success',
    },
    {
      label: 'Completed',
      value: jobs.filter((j) => j.status === 'COMPLETED').length,
      icon: TrendingUp,
      color: 'text-foreground',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-secondary/50 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-md">
            {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {profile?.full_name || 'User'}!
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Here&apos;s an overview of your account activity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/jobs">
              View all
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Loading...
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium">No jobs yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Post your first job request to get started.
              </p>
              <Button asChild className="mt-4">
                <Link href="/post-a-job">Post a Job</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.service_type} · {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={job.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/post-a-job">Post a Job</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">Browse Projects</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/profile">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
