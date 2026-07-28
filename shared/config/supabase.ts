import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicConfig } from '@/shared/config/supabase-env';

const { url, key } = getSupabasePublicConfig();

// Server Components use a non-persistent anonymous client. Browser code uses
// Supabase's SSR client so auth cookies are available to middleware and layouts.
export const supabase =
  typeof window === 'undefined'
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : createBrowserClient(url, key);

/**
 * Returns the canonical authentication callback URL dynamically.
 * Resolves window.location.origin on the client side, or environment variables in SSR,
 * eliminating hardcoded localhost references.
 */
export function getAuthCallbackUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin.replace(/\/+$/, '')}/auth/callback`;
  }

  let siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (siteUrl) {
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`;
    }
    return `${siteUrl.replace(/\/+$/, '')}/auth/callback`;
  }

  return 'https://www.myclientwork.online/auth/callback';
}

/**
 * Returns the canonical reset password URL dynamically.
 */
export function getAuthResetPasswordUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin.replace(/\/+$/, '')}/reset-password`;
  }

  let siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (siteUrl) {
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`;
    }
    return `${siteUrl.replace(/\/+$/, '')}/reset-password`;
  }

  return 'https://www.myclientwork.online/reset-password';
}
