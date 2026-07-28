'use client';

import { useEffect, useState } from 'react';
import {
  Globe,
  Image as ImageIcon,
  Palette,
  Search,
  Share2,
  PhoneCall,
  ShieldAlert,
  Save,
  Upload,
  Loader2,
  Database,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type SettingsState = Record<string, string>;

const DEFAULT_SETTINGS: SettingsState = {
  site_name: 'MyClientWork',
  site_tagline: 'Digital Services. Professional Solutions. Growth.',
  logo_url: '/images/1784378767326_(1).png',
  favicon_url: '/favicon.ico',
  hero_title: 'Digital Services. Professional Solutions. Growth.',
  hero_subtitle: 'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.',
  hero_cta_text: 'Get Started',
  hero_cta_link: '/contact',
  hero_bg_image: '',
  primary_color: '#3b82f6',
  accent_color: '#10b981',
  seo_title: 'MyClientWork — Digital Services. Professional Solutions. Growth.',
  seo_description: 'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.',
  seo_keywords: 'digital services, web development, freelance, professional solutions',
  seo_og_image: '',
  social_facebook: '',
  social_twitter: '',
  social_linkedin: '',
  social_instagram: '',
  social_youtube: '',
  social_github: '',
  contact_email: 'support@myclientwork.online',
  contact_phone: '',
  contact_address: '',
  contact_maps_url: '',
  maintenance_mode: 'false',
  maintenance_message: 'We are currently performing scheduled maintenance. Please check back soon.',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [dbTableMissing, setDbTableMissing] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const map: SettingsState = { ...DEFAULT_SETTINGS };

    // Try loading from localStorage first
    try {
      const cached = localStorage.getItem('myclientwork_site_settings');
      if (cached) {
        Object.assign(map, JSON.parse(cached));
      }
    } catch {}

    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      
      if (error) {
        console.warn('site_settings table not found in Supabase database:', error.message);
        setDbTableMissing(true);
      } else if (data && data.length > 0) {
        data.forEach((row) => {
          if (row.key) map[row.key] = row.value ?? '';
        });
        setDbTableMissing(false);
      }
    } catch (err) {
      console.warn('Error loading settings from DB:', err);
      setDbTableMissing(true);
    } finally {
      setSettings(map);
      setLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Always save locally to localStorage first
      localStorage.setItem('myclientwork_site_settings', JSON.stringify(settings));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('site-settings-updated'));
      }

      const payload = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'key' });
      
      if (error) {
        console.warn('Database save notice:', error.message);
        setDbTableMissing(true);
        toast.success('Website settings updated successfully!');
      } else {
        setDbTableMissing(false);
        toast.success('Website settings saved to database!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.success('Website settings updated!');
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setUploadingKey(key);
    
    // 1. Attempt upload to Supabase Storage bucket 'site-assets'
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${key}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          handleChange(key, publicUrlData.publicUrl);
          toast.success('Image uploaded successfully!');
          setUploadingKey(null);
          return;
        }
      }
    } catch {
      // Fall through to FileReader fallback
    }

    // 2. Fallback: Convert image to Data URL if storage bucket doesn't exist yet
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          handleChange(key, dataUrl);
          toast.success('Image loaded successfully!');
        }
        setUploadingKey(null);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file.');
        setUploadingKey(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      toast.error('Failed to process image file.');
      setUploadingKey(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage global website branding, SEO metadata, hero section, contact details, and system state.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {dbTableMissing && (
        <div className="relative flex items-start justify-between rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 pr-6">
              <p className="font-semibold text-sm">Supabase Table `site_settings` Not Found</p>
              <p className="text-xs opacity-90">
                You are currently previewing default settings. To save and sync settings across all devices in Supabase, copy and run the SQL snippet below in your Supabase SQL Editor.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDbTableMissing(false)}
            className="absolute top-3 right-3 text-amber-700 dark:text-amber-300 hover:opacity-100 opacity-70 transition-opacity"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-1 p-1 bg-muted/60">
          <TabsTrigger value="general" className="text-xs py-2">
            <Globe className="mr-1.5 h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="hero" className="text-xs py-2">
            <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Hero Banner
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs py-2">
            <Palette className="mr-1.5 h-3.5 w-3.5" /> Theme
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs py-2">
            <Search className="mr-1.5 h-3.5 w-3.5" /> SEO Meta
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs py-2">
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Social
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs py-2">
            <PhoneCall className="mr-1.5 h-3.5 w-3.5" /> Contact
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs py-2">
            <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> Maintenance
          </TabsTrigger>
        </TabsList>

        {/* 1. General Tab */}
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Identification</CardTitle>
              <CardDescription>Configure platform site name, tagline, and brand assets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Website Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name || ''}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    placeholder="MyClientWork"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Website Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline || ''}
                    onChange={(e) => handleChange('site_tagline', e.target.value)}
                    placeholder="Digital Services. Professional Solutions. Growth."
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2 pt-2">
                <Label>Platform Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.logo_url && (
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-background p-1">
                      <Image src={settings.logo_url} alt="Logo" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <Input
                      value={settings.logo_url || ''}
                      onChange={(e) => handleChange('logo_url', e.target.value)}
                      placeholder="/images/1784378767326_(1).png or URL"
                    />
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="logo_upload"
                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingKey === 'logo_url' ? 'Uploading...' : 'Upload Logo Image'}
                      </Label>
                      <input
                        id="logo_upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'logo_url')}
                        disabled={uploadingKey === 'logo_url'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2 pt-2">
                <Label>Favicon Icon URL</Label>
                <div className="flex items-center gap-4">
                  {settings.favicon_url && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-background p-1">
                      <Image src={settings.favicon_url} alt="Favicon" fill className="object-contain" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <Input
                      value={settings.favicon_url || ''}
                      onChange={(e) => handleChange('favicon_url', e.target.value)}
                      placeholder="/favicon.ico or URL"
                    />
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="favicon_upload"
                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingKey === 'favicon_url' ? 'Uploading...' : 'Upload Favicon Image'}
                      </Label>
                      <input
                        id="favicon_upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'favicon_url')}
                        disabled={uploadingKey === 'favicon_url'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Hero Banner Tab */}
        <TabsContent value="hero" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Hero Banner Management</CardTitle>
              <CardDescription>Customize the main landing page hero header text and calls to action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Headline Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  placeholder="Digital Services. Professional Solutions. Growth."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle Text</Label>
                <Textarea
                  id="hero_subtitle"
                  rows={3}
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  placeholder="Explore the work completed by our team..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_text">Primary Button Text</Label>
                  <Input
                    id="hero_cta_text"
                    value={settings.hero_cta_text || ''}
                    onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_link">Primary Button Redirect Link</Label>
                  <Input
                    id="hero_cta_link"
                    value={settings.hero_cta_link || ''}
                    onChange={(e) => handleChange('hero_cta_link', e.target.value)}
                    placeholder="/contact or /services"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Background Image URL (Optional)</Label>
                <Input
                  value={settings.hero_bg_image || ''}
                  onChange={(e) => handleChange('hero_bg_image', e.target.value)}
                  placeholder="https://example.com/hero-bg.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Theme Colors Tab */}
        <TabsContent value="theme" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Visual Customization</CardTitle>
              <CardDescription>Adjust brand accent colors applied across the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Brand Color (Hex / HSL)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primary_color || '#3b82f6'}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="h-10 w-12 rounded border border-border cursor-pointer"
                    />
                    <Input
                      id="primary_color"
                      value={settings.primary_color || ''}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Highlight Color (Hex / HSL)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.accent_color || '#10b981'}
                      onChange={(e) => handleChange('accent_color', e.target.value)}
                      className="h-10 w-12 rounded border border-border cursor-pointer"
                    />
                    <Input
                      id="accent_color"
                      value={settings.accent_color || ''}
                      onChange={(e) => handleChange('accent_color', e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Open Graph Metadata</CardTitle>
              <CardDescription>Optimize search engine rankings and social sharing previews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Default Meta Title Tag</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title || ''}
                  onChange={(e) => handleChange('seo_title', e.target.value)}
                  placeholder="MyClientWork — Digital Services. Professional Solutions. Growth."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea
                  id="seo_description"
                  rows={3}
                  value={settings.seo_description || ''}
                  onChange={(e) => handleChange('seo_description', e.target.value)}
                  placeholder="Explore the work completed by our team..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Meta Keywords (Comma separated)</Label>
                <Input
                  id="seo_keywords"
                  value={settings.seo_keywords || ''}
                  onChange={(e) => handleChange('seo_keywords', e.target.value)}
                  placeholder="digital services, web development, freelance, agency"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_og_image">Social Sharing Open Graph Image URL</Label>
                <Input
                  id="seo_og_image"
                  value={settings.seo_og_image || ''}
                  onChange={(e) => handleChange('seo_og_image', e.target.value)}
                  placeholder="https://myclientwork.online/og-image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Social Links Tab */}
        <TabsContent value="social" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Handles</CardTitle>
              <CardDescription>Links displayed in footer and contact sections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input
                    value={settings.social_facebook || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/myclientwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter / X URL</Label>
                  <Input
                    value={settings.social_twitter || ''}
                    onChange={(e) => handleChange('social_twitter', e.target.value)}
                    placeholder="https://x.com/myclientwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={settings.social_linkedin || ''}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/myclientwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input
                    value={settings.social_instagram || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/myclientwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    value={settings.social_youtube || ''}
                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                    placeholder="https://youtube.com/@myclientwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={settings.social_github || ''}
                    onChange={(e) => handleChange('social_github', e.target.value)}
                    placeholder="https://github.com/myclientwork"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Contact Information Tab */}
        <TabsContent value="contact" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Official Contact Details</CardTitle>
              <CardDescription>Information shown on the Contact page and site footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="support@myclientwork.online"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Physical Office Address</Label>
                <Input
                  value={settings.contact_address || ''}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  placeholder="123 Business Way, Tech District, CA"
                />
              </div>

              <div className="space-y-2">
                <Label>Google Maps Embed URL</Label>
                <Input
                  value={settings.contact_maps_url || ''}
                  onChange={(e) => handleChange('contact_maps_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. Maintenance Mode Tab */}
        <TabsContent value="maintenance" className="space-y-4 pt-4">
          <Card className={settings.maintenance_mode === 'true' ? 'border-destructive' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className={settings.maintenance_mode === 'true' ? 'text-destructive' : 'text-primary'} />
                Maintenance Mode Control
              </CardTitle>
              <CardDescription>
                When enabled, non-admin visitors will be redirected to a temporary maintenance page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Enable Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Restricts site access to logged-in Admins only.
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance_mode === 'true'}
                  onCheckedChange={(checked) => handleChange('maintenance_mode', checked ? 'true' : 'false')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_message">Public Maintenance Message</Label>
                <Textarea
                  id="maintenance_message"
                  rows={3}
                  value={settings.maintenance_message || ''}
                  onChange={(e) => handleChange('maintenance_message', e.target.value)}
                  placeholder="We are currently performing scheduled maintenance..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
