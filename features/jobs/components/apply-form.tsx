'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Lock,
  CheckCircle2,
  Loader2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobPosting } from '@/lib/types';

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  secondary: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  any: 'Any Level',
};

export function ApplyForm({ job }: { job: JobPosting }) {
  const { user, profile, loading: authLoading } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cover_letter: '',
    proposed_budget: '',
    availability_date: '',
    portfolio_url: '',
  });

  useEffect(() => {
    async function checkApplied() {
      if (!user || !job) return;
      const { data } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('user_id', user.id)
        .maybeSingle();
      setHasApplied(!!data);
    }
    checkApplied();
  }, [user, job]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !job) return;
    if (!form.cover_letter) {
      toast.error('Please write a cover letter.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        job_id: job.id,
        user_id: user.id,
        cover_letter: form.cover_letter,
        proposed_budget_cents: form.proposed_budget
          ? Math.round(parseFloat(form.proposed_budget) * 100)
          : null,
        currency: job.currency,
        availability_date: form.availability_date || null,
        portfolio_url: form.portfolio_url || null,
        status: 'SUBMITTED',
      });
      if (error) throw error;
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowForm(false);
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!user ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 font-semibold">Sign in to apply</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You need an account to submit an application. It&apos;s
              free and takes less than a minute.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : hasApplied ? (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <h3 className="mt-4 font-semibold">Application submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ve applied for this position. Track your
              application status in your dashboard.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard/applications">View my applications</Link>
            </Button>
          </CardContent>
        </Card>
      ) : showForm ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Apply for this position</h3>
            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover_letter">Cover Letter *</Label>
                <Textarea
                  id="cover_letter"
                  value={form.cover_letter}
                  onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                  placeholder="Tell us why you're a great fit..."
                  rows={5}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="proposed_budget">Proposed Budget ({job.currency})</Label>
                  <Input
                    id="proposed_budget"
                    type="number"
                    value={form.proposed_budget}
                    onChange={(e) => setForm({ ...form, proposed_budget: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability_date">Available From</Label>
                  <Input
                    id="availability_date"
                    type="date"
                    value={form.availability_date}
                    onChange={(e) => setForm({ ...form, availability_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={form.portfolio_url}
                  onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold">Ready to apply?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as <span className="font-medium">{profile?.full_name || user.email}</span>
            </p>
            <Button onClick={() => setShowForm(true)} className="mt-4 w-full">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Job meta info sidebar card */}
      <Card>
        <CardContent className="p-5 space-y-3 text-sm">
          <h3 className="font-semibold">Job Details</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            {EXPERIENCE_LABELS[job.experience_level] || job.experience_level}
          </div>
          {job.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
          )}
          {job.budget_min_cents && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              {job.currency} {(job.budget_min_cents / 100).toLocaleString()}
              {job.budget_max_cents && ` – ${(job.budget_max_cents / 100).toLocaleString()}`}
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
