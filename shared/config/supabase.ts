import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file. ' +
      'See .env.example for reference.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'myclientwork-auth-token',
    flowType: 'pkce',
  },
});

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

