'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Search,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Code2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { JobPostingForm } from '@/features/jobs/components/job-posting-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import type { JobPosting } from '@/lib/types';

const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  category: '',
  technologies: '',
  experience_level: 'mid',
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

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-600 dark:text-green-400',
  DRAFT: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  ARCHIVED: 'bg-gray-500/10 text-gray-500',
  CLOSED: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function AdminJobPostingsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load job postings');
    }
    setJobs((data as JobPosting[]) ?? []);
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(job: JobPosting) {
    setForm({
      slug: job.slug,
      title: job.title,
      description: job.description,
      category: job.category,
      technologies: job.technologies.join(', '),
      experience_level: job.experience_level,
      budget_min: job.budget_min_cents ? String(job.budget_min_cents / 100) : '',
      budget_max: job.budget_max_cents ? String(job.budget_max_cents / 100) : '',
      currency: job.currency,
      location: job.location || '',
      remote_ok: job.remote_ok,
      status: job.status,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
    });
    setEditingId(job.id);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.slug || !form.title || !form.description || !form.category) {
      toast.error('Please fill in slug, title, description, and category.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
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
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from('job_postings').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Job posting updated!');
      } else {
        const { error } = await supabase.from('job_postings').insert(payload);
        if (error) throw error;
        toast.success('Job posting created!');
      }
      setDialogOpen(false);
      await loadJobs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('job_postings').delete().eq('id', id);
      if (error) throw error;
      toast.success('Job posting deleted');
      setDeleteId(null);
      await loadJobs();
    } catch {
      toast.error('Failed to delete');
    }
  }

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.category.toLowerCase().includes(search.toLowerCase()) ||
      j.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Postings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage public job listings. Add, edit, or delete postings.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, category, or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>Total: <strong className="text-foreground">{jobs.length}</strong></span>
        <span>·</span>
        <span>Published: <strong className="text-green-600">{jobs.filter(j => j.status === 'PUBLISHED').length}</strong></span>
        <span>·</span>
        <span>Draft: <strong className="text-yellow-600">{jobs.filter(j => j.status === 'DRAFT').length}</strong></span>
      </div>

      {/* List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No job postings found.</p>
            <p className="mt-1 text-sm text-muted-foreground">Click &quot;Post a Job&quot; to create your first posting.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{job.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[job.status] || 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-primary">{job.category} · {job.experience_level}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                      )}
                      {job.remote_ok && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Remote OK
                        </span>
                      )}
                      {(job.budget_min_cents || job.budget_max_cents) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.currency} {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                          {' – '}
                          {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Code2 className="h-3 w-3" />
                        {job.technologies.slice(0, 3).join(', ')}
                        {job.technologies.length > 3 && ` +${job.technologies.length - 3}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit"
                      onClick={() => openEdit(job)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete"
                      onClick={() => setDeleteId(job.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Job Posting' : 'New Job Posting'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Slug + Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="senior-react-developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Web Development, Mobile, ML..."
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Senior React Developer"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the role, responsibilities, requirements..."
                rows={5}
              />
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            {/* Experience + Currency */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  value={form.experience_level}
                  onValueChange={(v) => setForm({ ...form, experience_level: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm({ ...form, currency: v })}
                >
                  <SelectTrigger>
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

            {/* Budget */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Min Budget</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.budget_min}
                  onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Budget</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.budget_max}
                  onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Location + Deadline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Remote, Kathmandu, Delhi..."
                />
              </div>
              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>

            {/* Remote + Status */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remote_ok"
                  checked={form.remote_ok}
                  onCheckedChange={(v) => setForm({ ...form, remote_ok: v === true })}
                />
                <Label htmlFor="remote_ok">Remote OK</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Posting' : 'Create Posting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job posting will be permanently deleted and
              removed from the public listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
