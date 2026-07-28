'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Mail,
  FolderKanban,
  ArrowRight,
  Package,
  ShoppingCart,
  Shield,
  IndianRupee,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import type { JobRequest, ContactMessage } from '@/lib/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    jobs: 0,
    users: 0,
    messages: 0,
    projects: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobRequest[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [jobsRes, usersRes, messagesRes, projectsRes, productsRes, ordersRes] = await Promise.all([
          supabase.from('job_requests').select('id, title, name, service_type, created_at, status').order('created_at', { ascending: false }).limit(5),
          supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id, subject, name, email, body, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('amount_cents, status'),
        ]);

        if (!isMounted) return;

        const jobs = (jobsRes.data as JobRequest[]) ?? [];
        const messages = (messagesRes.data as ContactMessage[]) ?? [];
        const allOrders = (ordersRes.data as { amount_cents: number; status: string }[]) ?? [];

        const totalRevenue = allOrders
          .filter((o) => o.status === 'PAID')
          .reduce((sum, o) => sum + (o.amount_cents || 0), 0);

        setStats({
          jobs: jobsRes.data?.length || 0,
          users: usersRes.count || 0,
          messages: messagesRes.data?.length || 0,
          projects: projectsRes.count || 0,
          products: productsRes.count || 0,
          orders: allOrders.length,
          revenue: totalRevenue,
        });

        setRecentJobs(jobs);
        setRecentMessages(messages);
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const primaryCards = useMemo(() => [
    { label: 'Client Requirements', value: stats.jobs, icon: Briefcase, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', href: '/admin/jobs' },
    { label: 'Registered Users', value: stats.users, icon: Users, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', href: '/admin/users' },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', href: '/admin/messages' },
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', href: '/admin/projects' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', href: '/admin/products' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', href: '/admin/orders' },
  ], [stats]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Monitor platform activity, manage requirements, users, and content.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <Skeleton className="h-11 w-11 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          : primaryCards.map((card) => (
              <Link key={card.label} href={card.href}>
                <Card className="transition-all hover:shadow-md hover:border-primary/30 h-full">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold tabular-nums">{card.value}</p>
                      <p className="text-xs font-medium text-muted-foreground truncate">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Revenue (Paid Orders)</p>
              {loading ? (
                <Skeleton className="h-7 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-bold tabular-nums">
                  ₹{(stats.revenue / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">View Orders</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products">Add Product</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/team">Add Team Member</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/projects">Add Project</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/settings">Site Settings</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Two-column grid: Recent Jobs + Recent Messages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Client Requirements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Client Requirements</h2>
            <Link href="/admin/jobs" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
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
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No requirements submitted yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <Link key={job.id} href={`/admin/jobs/${job.id}`}>
                  <Card className="transition-all hover:shadow-md hover:border-primary/30">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{job.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.name} · {job.service_type} · {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-3 shrink-0 text-[10px]">{job.status.replace(/_/g, ' ')}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No messages yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <Card key={msg.id} className="transition-all hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{msg.subject}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      From: {msg.name} ({msg.email})
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{msg.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
