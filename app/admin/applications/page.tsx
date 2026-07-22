'use client';

import { useEffect, useState } from 'react';
import { Search, FileCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { JobApplicationWithUser } from '@/lib/types';

type ApplicationWithJob = JobApplicationWithUser & {
  job_postings: { id: string; title: string; category: string };
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ACCEPTED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  WITHDRAWN: 'bg-secondary text-muted-foreground',
};

const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    const { data } = await supabase
      .from('job_applications')
      .select('*, job_postings(id, title, category), user_profiles(id, email, full_name, country, phone)')
      .order('created_at', { ascending: false });
    setApps((data as unknown as ApplicationWithJob[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(appId: string, newStatus: string) {
    setUpdating(appId);
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId);
      if (error) throw error;
      setApps(apps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
      toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  const filtered = apps.filter((a) => {
    const matchesSearch =
      a.user_profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.user_profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.job_postings?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage job applications. {apps.length} total.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by applicant or job title..."
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
            <SelectItem value="ALL">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <FileCheck className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No applications found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{app.job_postings?.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Applicant: <span className="font-medium text-foreground">
                        {app.user_profiles?.full_name || 'Unknown'}
                      </span> ({app.user_profiles?.email})
                    </p>
                    {app.user_profiles?.country && (
                      <p className="text-xs text-muted-foreground">
                        Location: {app.user_profiles.country}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {app.cover_letter}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {app.proposed_budget_cents && (
                        <span>Proposed: {app.currency} {(app.proposed_budget_cents / 100).toLocaleString()}</span>
                      )}
                      {app.availability_date && (
                        <span>Available: {new Date(app.availability_date).toLocaleDateString()}</span>
                      )}
                      {app.portfolio_url && (
                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Portfolio
                        </a>
                      )}
                      <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-secondary'}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                    <Select
                      value={app.status}
                      onValueChange={(v) => updateStatus(app.id, v)}
                      disabled={updating === app.id}
                    >
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
