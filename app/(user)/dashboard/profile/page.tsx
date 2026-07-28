'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Building2, Globe, Save, Loader2, Upload, Camera, Check, X, ShieldAlert } from 'lucide-react';
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

  // Avatar Upload States
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

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Validate format
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

      // Upload to Supabase Storage bucket: member-avatars
      const { error: uploadError } = await supabase.storage
        .from('member-avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: selectedFile.type,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update user_profiles avatar_url
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
      
      // Clean up file states
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

  // Extract avatar URL if present
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
  const userInitial = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <UserBackLink />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update your personal information. This data is used when you submit job requests.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* Circular Avatar Upload Panel */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-border/60 mb-6">
            <div 
              className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 hover:border-primary transition-all shadow-md flex items-center justify-center bg-muted"
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
                <div className="flex flex-col items-center text-muted-foreground">
                  <span className="text-2xl font-bold">{userInitial}</span>
                </div>
              )}

              {/* Hover to edit overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
                <span className="text-[10px] text-white font-semibold">Change Photo</span>
              </div>
            </div>

            {/* Hidden File Picker Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Progress Slider */}
            {uploading && (
              <div className="w-full max-w-[200px] space-y-1 text-center">
                <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress ?? 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Confirm Actions */}
            {previewUrl && !uploading && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSavePhoto}>
                  Save Photo
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelPhoto}>
                  Cancel
                </Button>
              </div>
            )}

            {!previewUrl && (
              <p className="text-[11px] text-muted-foreground">
                Click on the avatar to upload a custom picture (max 5MB: JPG, PNG, WebP)
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.email || ''} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+977-98XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="Nepal, India, USA..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Your company (optional)"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
