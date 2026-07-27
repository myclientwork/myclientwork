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
 * Returns the canonical authentication callback URL.
 * Prefers window.location.origin on the client side, or NEXT_PUBLIC_SITE_URL in production SSR,
 * falling back to http://localhost:3000/auth/callback.
 */
export function getAuthCallbackUrl(): string {
  let siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (typeof window !== 'undefined' && window.location.origin) {
    siteUrl = window.location.origin;
  }

  if (!siteUrl) {
    return 'http://localhost:3000/auth/callback';
  }

  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    siteUrl = `https://${siteUrl}`;
  }

  siteUrl = siteUrl.replace(/\/+$/, '');
  return `${siteUrl}/auth/callback`;
}

