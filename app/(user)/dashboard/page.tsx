'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  ShoppingCart,
  PlusCircle,
  ArrowRight,
  User,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobRequest } from '@/lib/types';

export default function DashboardOverviewPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    requirementsCount: 0,
    ordersCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (authLoading || !user) return;

      try {
        const [jobsCountRes, ordersCountRes, recentJobsRes] = await Promise.all([
          supabase
            .from('job_requests')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('job_requests')
            .select('id, title, service_type, created_at, status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        if (!isMounted) return;

        setStats({
          requirementsCount: jobsCountRes.count || 0,
          ordersCount: ordersCountRes.count || 0,
        });
        setRecentJobs((recentJobsRes.data as JobRequest[]) ?? []);
      } catch (err) {
        console.error('Error loading user dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const statCards = useMemo(() => [
    {
      label: 'Total Requirements Posted',
      value: stats.requirementsCount,
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      href: '/dashboard/jobs',
    },
    {
      label: 'Total Orders',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      href: '/dashboard/orders',
    },
  ], [stats]);

  const userDisplayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-md">
            {userInitial}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {userDisplayName}!
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Client Workspace Overview — manage your project requirements and orders.
            </p>
          </div>
        </div>
      </div>

      {/* Client Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-4 p-5">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <Link key={card.label} href={card.href}>
                <Card className="transition-all hover:shadow-md hover:border-primary/30 h-full">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold tabular-nums">{card.value}</p>
                      <p className="text-sm font-medium text-muted-foreground truncate">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/post-a-job">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Post New Requirement
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/jobs">
              <Briefcase className="mr-1.5 h-4 w-4" /> View My Requirements
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/orders">
              <Package className="mr-1.5 h-4 w-4" /> View My Orders
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/profile">
              <User className="mr-1.5 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Requirements List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Recent Requirements Submitted</h2>
          <Link href="/dashboard/jobs" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              You haven&apos;t posted any project requirements yet.{' '}
              <Link href="/post-a-job" className="text-primary hover:underline font-semibold">
                Post your first requirement now
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <Card className="transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {job.service_type} · Submitted on {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-3 shrink-0 text-[10px]">
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
