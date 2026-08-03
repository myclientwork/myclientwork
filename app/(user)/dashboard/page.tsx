'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ShoppingCart,
  PlusCircle,
  ArrowRight,
  User,
  Package,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobRequest } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

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
      label: 'Requirements Posted',
      value: stats.requirementsCount,
      icon: Briefcase,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      href: '/dashboard/jobs',
    },
    {
      label: 'Active & Complete Orders',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      href: '/dashboard/orders',
    },
  ], [stats]);

  const userDisplayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-2xl font-black shadow-lg shadow-cyan-500/20 ring-2 ring-white/10">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Welcome back, {userDisplayName}!
                </h1>
                <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                AI Client Workspace Console — Manage requirements, track milestones &amp; order specs.
              </p>
            </div>
          </div>
          <Button asChild className="rounded-xl shadow-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:scale-105 transition-all">
            <Link href="/post-a-job">
              <PlusCircle className="mr-2 h-4 w-4" /> Post Requirement
            </Link>
          </Button>
        </div>
      </div>

      {/* Client Stats Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-border/60 bg-card/60">
                <CardContent className="flex items-center gap-4 p-6">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <Link key={card.label} href={card.href} className="group block">
                <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 h-full">
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${card.bg} ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <card.icon className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-black tabular-nums text-foreground">{card.value}</p>
                      <p className="text-xs font-semibold text-muted-foreground truncate">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Quick Actions Bar */}
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-extrabold tracking-wide uppercase text-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex flex-wrap gap-3">
          <Button asChild size="sm" className="rounded-xl font-bold">
            <Link href="/post-a-job">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Post New Requirement
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl font-semibold border-border/80">
            <Link href="/dashboard/jobs">
              <Briefcase className="mr-1.5 h-4 w-4 text-cyan-400" /> View Requirements
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl font-semibold border-border/80">
            <Link href="/dashboard/orders">
              <Package className="mr-1.5 h-4 w-4 text-indigo-400" /> View Orders
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl font-semibold border-border/80">
            <Link href="/dashboard/profile">
              <User className="mr-1.5 h-4 w-4 text-purple-400" /> Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Requirements List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Recent Submitted Requirements</h2>
          <Link href="/dashboard/jobs" className="text-xs text-primary hover:text-cyan-400 flex items-center gap-1 font-bold transition-colors">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-border/60">
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <Card className="rounded-2xl border-border/60 bg-card/60 p-10 text-center backdrop-blur-xl">
            <CardContent className="p-0 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                You haven&apos;t posted any project requirements yet.{' '}
              </p>
              <Button asChild size="sm" className="mt-4 rounded-xl font-bold">
                <Link href="/post-a-job">Post Your First Requirement Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block group">
                <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                        {job.service_type} · Submitted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-4 shrink-0 text-[10px] font-extrabold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
