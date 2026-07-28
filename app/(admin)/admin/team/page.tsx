'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, UserCog, Upload, X, Loader2, Camera } from 'lucide-react';
import { AdminBackLink } from '@/shared/components/layout/admin-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import type { Member } from '@/lib/types';

const EMPTY_FORM = {
  slug: '',
  full_name: '',
  title: '',
  bio: '',
  experience_summary: '',
  location: '',
  email: '',
  phone: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',
  avatar_url: '',
  skills: '',
  certifications: '',
  achievements: '',
  availability_status: 'available',
  display_order: 0,
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const { data } = await supabase
      .from('members')
      .select('*')
      .order('display_order', { ascending: true });
    setMembers((data as Member[]) ?? []);
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(member: Member) {
    setForm({
      slug: member.slug,
      full_name: member.full_name,
      title: member.title,
      bio: member.bio,
      experience_summary: member.experience_summary || '',
      location: member.location || '',
      email: member.email || '',
      phone: member.phone || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      portfolio_url: member.portfolio_url || '',
      avatar_url: member.avatar_url || '',
      skills: member.skills.join(', '),
      certifications: member.certifications.join('\n'),
      achievements: member.achievements.join('\n'),
      availability_status: member.availability_status,
      display_order: member.display_order,
    });
    setEditingId(member.id);
    setDialogOpen(true);
  }

  // Upload avatar to Supabase Storage
  async function handleAvatarUpload(file: File) {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('member-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        if (
          uploadError.message?.toLowerCase().includes('bucket not found') ||
          uploadError.message?.toLowerCase().includes('not found') ||
          (uploadError as { statusCode?: string | number }).statusCode === '404' ||
          (uploadError as { statusCode?: string | number }).statusCode === 404 ||
          (uploadError as { status?: number }).status === 400
        ) {
          throw new Error(
            'Bucket "member-avatars" not found in Supabase. Please create a public bucket named "member-avatars" in Supabase Dashboard -> Storage (or run the provided migration SQL script).'
          );
        }
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
      toast.success('Photo uploaded successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.slug || !form.full_name || !form.title || !form.bio) {
      toast.error('Please fill in slug, name, title, and bio.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        full_name: form.full_name,
        title: form.title,
        bio: form.bio,
        experience_summary: form.experience_summary || null,
        location: form.location || null,
        email: form.email || null,
        phone: form.phone || null,
        linkedin_url: form.linkedin_url || null,
        github_url: form.github_url || null,
        portfolio_url: form.portfolio_url || null,
        avatar_url: form.avatar_url || null,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: form.certifications.split('\n').map((s) => s.trim()).filter(Boolean),
        achievements: form.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
        availability_status: form.availability_status,
        display_order: form.display_order,
      };

      if (editingId) {
        const { error } = await supabase.from('members').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Team member updated');
      } else {
        const { error } = await supabase.from('members').insert(payload);
        if (error) throw error;
        toast.success('Team member added');
      }
      setDialogOpen(false);
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      toast.success('Team member deleted');
      setDeleteId(null);
      await loadMembers();
    } catch {
      toast.error('Failed to delete');
    }
  }

  return (
    <div className="space-y-6">
      <AdminBackLink />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, and remove team members.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <UserCog className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No team members yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    {member.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.avatar_url}
                        alt={member.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    <p className="text-sm text-primary">{member.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="Edit" onClick={() => openEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Delete"
                    onClick={() => setDeleteId(member.id)}
                  >
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
            <DialogTitle>{editingId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Avatar Upload Section */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
                  {form.avatar_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.avatar_url}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, avatar_url: '' })}
                        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Upload controls */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                      // Reset so same file can be re-uploaded
                      e.target.value = '';
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP. Max 5MB.
                  </p>
                </div>

                {/* Or enter URL manually */}
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Or paste URL</Label>
                  <Input
                    value={form.avatar_url}
                    onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Slug + Full Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="john-doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio *</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Experience Summary</Label>
              <Textarea
                value={form.experience_summary}
                onChange={(e) => setForm({ ...form, experience_summary: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <Input
                  value={form.portfolio_url}
                  onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills (comma-separated)</Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="space-y-2">
              <Label>Certifications (one per line)</Label>
              <Textarea
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Achievements (one per line)</Label>
              <Textarea
                value={form.achievements}
                onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The team member will be permanently removed.
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
