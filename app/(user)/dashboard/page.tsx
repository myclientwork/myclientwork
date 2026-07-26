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
  const { user, profile, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      if (authLoading || !user) return;
      const { data } = await supabase
        .from('job_requests')
        .select('id, title, service_type, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setJobs((data as JobRequest[]) ?? []);
      setLoading(false);
    }
    loadJobs();
  }, [user, authLoading]);

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



      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/post-a-job">
              Post Requirement
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">Browse Products</Link>
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
