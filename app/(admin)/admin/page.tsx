'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Mail,
  FolderKanban,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Package,
  ShoppingCart,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { JobRequest, ContactMessage } from '@/lib/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    jobs: 0,
    users: 0,
    messages: 0,
    projects: 0,
    applications: 0,
    pendingJobs: 0,
    completedJobs: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobRequest[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [jobsRes, usersRes, messagesRes, projectsRes, appsRes, productsRes, ordersRes] = await Promise.all([
        supabase.from('job_requests').select('id, title, name, service_type, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id, subject, name, email, body, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('amount_cents, status'),
      ]);

      const jobs = (jobsRes.data as JobRequest[]) ?? [];
      const messages = (messagesRes.data as ContactMessage[]) ?? [];
      const allOrders = (ordersRes.data as { amount_cents: number; status: string }[]) ?? [];

      setStats({
        jobs: jobsRes.data?.length || 0,
        users: usersRes.count || 0,
        messages: messagesRes.data?.length || 0,
        projects: projectsRes.count || 0,
        applications: appsRes.count || 0,
        pendingJobs: jobs.filter((j) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(j.status)).length,
        completedJobs: jobs.filter((j) => j.status === 'COMPLETED').length,
        products: productsRes.count || 0,
        orders: allOrders.length,
        revenue: allOrders.filter((o) => o.status === 'PAID').reduce((sum, o) => sum + o.amount_cents, 0),
      });
      setRecentJobs(jobs);
      setRecentMessages(messages);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: 'Client Requirements', value: stats.jobs, icon: Briefcase, color: 'text-primary', href: '/admin/jobs' },
    { label: 'Applications', value: stats.applications, icon: FileCheck, color: 'text-success', href: '/admin/applications' },
    { label: 'Registered Users', value: stats.users, icon: Users, color: 'text-accent', href: '/admin/users' },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'text-warning', href: '/admin/messages' },
    { label: 'Products', value: stats.products, icon: Package, color: 'text-primary', href: '/admin/products' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'text-success', href: '/admin/orders' },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Monitor platform activity, manage jobs, users, and content.
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingJobs}</p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completedJobs}</p>
              <p className="text-sm text-muted-foreground">Completed Jobs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">${(stats.revenue / 100).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/post-a-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Requirement
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products">Add Product</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/team">Add Team Member</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/projects">Add Project</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Client Requirements</h2>
          <Link href="/admin/jobs" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
        ) : recentJobs.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No jobs submitted yet.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link key={job.id} href={`/admin/jobs/${job.id}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.name} · {job.service_type} · {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{job.status.replace(/_/g, ' ')}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Messages</h2>
          <Link href="/admin/messages" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
        ) : recentMessages.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No messages yet.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{msg.subject}</p>
                    <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    From: {msg.name} ({msg.email})
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{msg.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
