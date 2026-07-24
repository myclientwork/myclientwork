'use client';

import { useEffect, useState } from 'react';
import { Search, FileCheck, Loader2, ExternalLink, Eye, User, Mail, Globe, Phone, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  UNDER_REVIEW: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
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
  const [selectedApp, setSelectedApp] = useState<ApplicationWithJob | null>(null);

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
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
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
          Review and manage candidate job applications. {apps.length} total applications.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by applicant name, email, or job title..."
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
            <p className="mt-1 text-sm text-muted-foreground">
              Candidate applications will appear here when submitted.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{app.job_postings?.title || 'Unknown Position'}</h3>
                      {app.job_postings?.category && (
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                          {app.job_postings.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Applicant:{' '}
                      <span className="font-medium text-foreground">
                        {app.user_profiles?.full_name || 'Unknown'}
                      </span>{' '}
                      ({app.user_profiles?.email})
                    </p>
                    {app.user_profiles?.country && (
                      <p className="text-xs text-muted-foreground">
                        Location: {app.user_profiles.country}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {app.cover_letter}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {app.proposed_budget_cents && (
                        <span>Proposed: {app.currency} {(app.proposed_budget_cents / 100).toLocaleString()}</span>
                      )}
                      {app.availability_date && (
                        <span>Available: {new Date(app.availability_date).toLocaleDateString()}</span>
                      )}
                      {app.portfolio_url && (
                        <a
                          href={app.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Portfolio <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-secondary'}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        className="h-8 text-xs"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                      <Select
                        value={app.status}
                        onValueChange={(v) => updateStatus(app.id, v)}
                        disabled={updating === app.id}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Full Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        {selectedApp && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Application: {selectedApp.job_postings?.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Applicant Card */}
              <div className="rounded-lg border p-4 bg-muted/40 space-y-2 text-sm">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Candidate Profile
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5" /> Name: <strong className="text-foreground">{selectedApp.user_profiles?.full_name || 'N/A'}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email: <strong className="text-foreground">{selectedApp.user_profiles?.email || 'N/A'}</strong>
                  </div>
                  {selectedApp.user_profiles?.country && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" /> Country: <strong className="text-foreground">{selectedApp.user_profiles.country}</strong>
                    </div>
                  )}
                  {selectedApp.user_profiles?.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> Phone: <strong className="text-foreground">{selectedApp.user_profiles.phone}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Cover Letter</h4>
                <div className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-line bg-card">
                  {selectedApp.cover_letter}
                </div>
              </div>

              {/* Application Details */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Proposed Budget</p>
                  <p className="mt-1 font-semibold">
                    {selectedApp.proposed_budget_cents
                      ? `${selectedApp.currency} ${(selectedApp.proposed_budget_cents / 100).toLocaleString()}`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Available From</p>
                  <p className="mt-1 font-semibold">
                    {selectedApp.availability_date
                      ? new Date(selectedApp.availability_date).toLocaleDateString()
                      : 'Immediate'}
                  </p>
                </div>
              </div>

              {selectedApp.portfolio_url && (
                <div className="rounded-lg border p-3 text-sm">
                  <p className="text-xs text-muted-foreground">Portfolio Link</p>
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    {selectedApp.portfolio_url} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* Status Selector */}
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                <div>
                  <p className="text-sm font-semibold">Application Status</p>
                  <p className="text-xs text-muted-foreground">Update candidate status</p>
                </div>
                <Select
                  value={selectedApp.status}
                  onValueChange={(v) => updateStatus(selectedApp.id, v)}
                  disabled={updating === selectedApp.id}
                >
                  <SelectTrigger className="w-44">
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

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
