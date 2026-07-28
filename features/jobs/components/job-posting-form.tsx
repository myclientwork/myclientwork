'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  category: '',
  technologies: '',
  experience_level: 'entry',
  budget_min: '',
  budget_max: '',
  currency: 'USD',
  location: '',
  remote_ok: true,
  status: 'PUBLISHED',
  deadline: '',
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'NPR', 'AUD', 'CAD'];
const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'any', label: 'Any Level' },
];

export function JobPostingForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug || !form.title || !form.description || !form.category) {
      toast.error('Please fill in slug, title, description, and category.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('job_postings').insert({
        slug: form.slug,
        title: form.title,
        description: form.description,
        category: form.category,
        technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        experience_level: form.experience_level,
        budget_min_cents: form.budget_min ? Math.round(parseFloat(form.budget_min) * 100) : null,
        budget_max_cents: form.budget_max ? Math.round(parseFloat(form.budget_max) * 100) : null,
        currency: form.currency,
        location: form.location || null,
        remote_ok: form.remote_ok,
        status: form.status,
        deadline: form.deadline || null,
        created_by: user?.id || null,
      });

      if (error) throw error;
      toast.success('Job posting created successfully!');
      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Failed to create job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success animate-scale-in">
          <Briefcase className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Job posting created!</h2>
        <p className="mt-3 text-muted-foreground">
          Your job posting has been published and is now visible to all visitors.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => setSuccess(false)}>Create another posting</Button>
          <Button asChild variant="outline">
            <Link href="/jobs">View job listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="senior-react-developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Web Development, Mobile, ML..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Senior React Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB, AWS"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={form.experience_level}
                onValueChange={(v) => setForm({ ...form, experience_level: v })}
              >
                <SelectTrigger id="experience_level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm({ ...form, currency: v })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Minimum Budget</Label>
              <Input
                id="budget_min"
                type="number"
                min="0"
                value={form.budget_min}
                onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_max">Maximum Budget</Label>
              <Input
                id="budget_max"
                type="number"
                min="0"
                value={form.budget_max}
                onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Remote, Nepal, India..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remote_ok"
                checked={form.remote_ok}
                onCheckedChange={(v) => setForm({ ...form, remote_ok: v === true })}
              />
              <Label htmlFor="remote_ok">Remote OK</Label>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Publish now</SelectItem>
                  <SelectItem value="DRAFT">Save as draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Creating...' : 'Create Job Posting'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
