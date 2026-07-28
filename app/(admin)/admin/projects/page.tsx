'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FolderKanban, Lock } from 'lucide-react';
import { AdminBackLink } from '@/shared/components/layout/admin-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

const EMPTY_FORM = {
  slug: '',
  title: '',
  short_summary: '',
  problem: '',
  solution: '',
  outcome: '',
  body: '',
  category: '',
  technologies: '',
  demo_url: '',
  source_code_url: '',
  cover_image_url: '',
  completion_date: '',
  status: 'DRAFT',
  featured: false,
  is_confidential: false,
  display_order: 0,
  seo_title: '',
  seo_description: '',
};

const STATUSES = ['DRAFT', 'SUBMITTED', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED'];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setForm({
      slug: project.slug,
      title: project.title,
      short_summary: project.short_summary,
      problem: project.problem || '',
      solution: project.solution || '',
      outcome: project.outcome || '',
      body: project.body || '',
      category: project.category,
      technologies: project.technologies.join(', '),
      demo_url: project.demo_url || '',
      source_code_url: project.source_code_url || '',
      cover_image_url: project.cover_image_url || '',
      completion_date: project.completion_date || '',
      status: project.status,
      featured: project.featured,
      is_confidential: project.is_confidential,
      display_order: project.display_order,
      seo_title: project.seo_title || '',
      seo_description: project.seo_description || '',
    });
    setEditingId(project.id);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.slug || !form.title || !form.short_summary || !form.category) {
      toast.error('Please fill in slug, title, summary, and category.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        short_summary: form.short_summary,
        problem: form.problem || null,
        solution: form.solution || null,
        outcome: form.outcome || null,
        body: form.body || null,
        category: form.category,
        technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        demo_url: form.demo_url || null,
        source_code_url: form.source_code_url || null,
        cover_image_url: form.cover_image_url || null,
        completion_date: form.completion_date || null,
        status: form.status,
        featured: form.featured,
        is_confidential: form.is_confidential,
        display_order: form.display_order,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      if (editingId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert(payload);
        if (error) throw error;
        toast.success('Project created');
      }
      setDialogOpen(false);
      await loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Project deleted');
      await loadProjects();
    } catch {
      toast.error('Failed to delete');
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: 'bg-success/10 text-success',
    DRAFT: 'bg-secondary text-muted-foreground',
    ARCHIVED: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6">
      <AdminBackLink />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, and manage portfolio projects.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No projects yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {project.cover_image_url && (
                    <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.cover_image_url} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{project.title}</p>
                      {project.is_confidential && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.short_summary}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[project.status] || 'bg-secondary'}`}>
                        {project.status}
                      </span>
                      {project.featured && <span className="text-xs text-primary">★ Featured</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-project" />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web Application" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Short Summary *</Label>
              <Textarea value={form.short_summary} onChange={(e) => setForm({ ...form, short_summary: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Problem</Label>
              <Textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Textarea value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Full Body</Label>
              <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Demo URL</Label>
                <Input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Source Code URL</Label>
                <Input value={form.source_code_url} onChange={(e) => setForm({ ...form, source_code_url: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Completion Date</Label>
                <Input type="date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v === true })} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="confidential" checked={form.is_confidential} onCheckedChange={(v) => setForm({ ...form, is_confidential: v === true })} />
                <Label htmlFor="confidential">Confidential (login required)</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
