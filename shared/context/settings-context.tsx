'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SettingsMap = Record<string, string>;

export const DEFAULT_SETTINGS: SettingsMap = {
  site_name: 'MyClientWork',
  site_tagline: 'Digital Services. Professional Solutions.',
  logo_url: '/images/1784378767326_(1).png',
  favicon_url: '/favicon.ico',
  hero_title: 'We Build Production-Grade Apps That Scale Effortlessly',
  hero_subtitle: 'Turn your complex project requirements into elegant, resilient, and ultra-fast web & mobile applications. Explore our portfolio or post your custom requirement today.',
  hero_cta_text: 'Post Requirement',
  hero_cta_link: '/post-a-job',
  hero_bg_image: '',
  primary_color: '#3b82f6',
  accent_color: '#10b981',
  seo_title: 'MyClientWork — Digital Services. Professional Solutions.',
  seo_description: 'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.',
  seo_keywords: 'digital services, web development, freelance, professional solutions',
  contact_email: 'support@myclientwork.online',
  contact_phone: '',
  contact_address: '',
  social_facebook: '',
  social_twitter: '',
  social_linkedin: '',
  social_instagram: '',
  social_youtube: '',
  social_github: '',
  maintenance_mode: 'false',
  maintenance_message: 'We are currently performing scheduled maintenance. Please check back soon.',
};

interface SettingsContextType {
  settings: SettingsMap;
  getSetting: (key: string, fallback?: string) => string;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  getSetting: (key, fallback = '') => DEFAULT_SETTINGS[key] ?? fallback,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS);

  async function loadSettings() {
    const map: SettingsMap = { ...DEFAULT_SETTINGS };

    // 1. Check local storage cache
    try {
      const cached = localStorage.getItem('myclientwork_site_settings');
      if (cached) {
        Object.assign(map, JSON.parse(cached));
      }
    } catch {}

    // 2. Fetch from Supabase site_settings table
    try {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data && data.length > 0) {
        data.forEach((row) => {
          if (row.key && row.value !== null && row.value !== undefined) {
            map[row.key] = row.value;
          }
        });
        localStorage.setItem('myclientwork_site_settings', JSON.stringify(map));
      }
    } catch {
      // Ignore DB missing error silently
    }

    setSettings(map);
  }

  useEffect(() => {
    loadSettings();

    // Event listeners for settings updates across components & windows
    const handleUpdate = () => loadSettings();
    window.addEventListener('site-settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('site-settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update dynamic favicon link element in <head>
  useEffect(() => {
    if (!settings.favicon_url || typeof document === 'undefined') return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = settings.favicon_url;
  }, [settings.favicon_url]);

  function getSetting(key: string, fallback = '') {
    return settings[key] ?? DEFAULT_SETTINGS[key] ?? fallback;
  }

  return (
    <SettingsContext.Provider value={{ settings, getSetting, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
