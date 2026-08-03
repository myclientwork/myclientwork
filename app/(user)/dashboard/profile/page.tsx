'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Building2, Globe, Save, Loader2, Camera, Sparkles } from 'lucide-react';
import { UserBackLink } from '@/shared/components/layout/user-back-link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    company: '',
    country: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        country: profile.country || '',
      });
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and WebP formats are supported');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSavePhoto = async () => {
    if (!user || !selectedFile) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      const ext = selectedFile.name.split('.').pop() || 'jpg';
      const fileName = `user-${user.id}-${Date.now()}.${ext}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('member-avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: selectedFile.type,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from('user_profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      setUploadProgress(100);
      await refreshProfile();
      toast.success('Profile picture updated successfully!');
      
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          company: form.company,
          country: form.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
  const userInitial = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <UserBackLink />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Account Profile
        </h1>
        <p className="mt-1 text-xs text-muted-foreground font-medium">
          Update your contact details and avatar used across client requirements and milestones.
        </p>
      </div>

      <Card className="max-w-2xl rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            Personal Information &amp; Specs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {/* Avatar Upload Panel */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-border/50 mb-6">
            <div 
              className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 hover:border-primary transition-all duration-300 shadow-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 ring-4 ring-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl || avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl || avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-white">
                  <span className="text-3xl font-black">{userInitial}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity backdrop-blur-xs">
                <Camera className="h-5 w-5 text-white" />
                <span className="text-[10px] text-white font-bold">Change Photo</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading && (
              <div className="w-full max-w-[200px] space-y-1 text-center">
                <p className="text-xs text-muted-foreground font-medium">Uploading... {uploadProgress}%</p>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress ?? 0}%` }}
                  />
                </div>
              </div>
            )}

            {previewUrl && !uploading && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSavePhoto} className="rounded-xl font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  Save Photo
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelPhoto} className="rounded-xl font-semibold">
                  Cancel
                </Button>
              </div>
            )}

            {!previewUrl && (
              <p className="text-[11px] text-muted-foreground font-medium">
                Click avatar to upload custom picture (max 5MB: JPG, PNG, WebP)
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
              <Input id="email" value={profile?.email || ''} disabled className="bg-muted/40 rounded-xl font-mono text-xs border-border/50" />
              <p className="text-[11px] text-muted-foreground">Primary email address linked to your account.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-xs font-bold text-foreground">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                className="rounded-xl border-border/80 bg-card/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-foreground">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+977-98XXXXXXXX"
                  className="rounded-xl border-border/80 bg-card/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-xs font-bold text-foreground">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="Nepal, India, USA..."
                  className="rounded-xl border-border/80 bg-card/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-xs font-bold text-foreground">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Your company (optional)"
                className="rounded-xl border-border/80 bg-card/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
              />
            </div>
            <Button type="submit" disabled={loading} className="rounded-xl font-bold shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
