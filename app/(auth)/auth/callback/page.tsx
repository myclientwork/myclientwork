'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    // Guard against double-invocation in React Strict Mode
    if (processed.current) return;
    processed.current = true;

    async function handleCallback() {
      try {
        // ── Step 1: Exchange the PKCE code for a session ──────────────
        // Supabase v2 uses PKCE by default. After Google redirects back,
        // the URL contains ?code=... which must be exchanged before
        // getSession() will return anything.
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const errorParam = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        // Handle OAuth provider errors (e.g. user denied consent)
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          toast.error(errorDescription || 'Authentication was cancelled.');
          router.replace('/auth/login');
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            toast.error('Authentication failed. Please try signing in again.');
            router.replace('/auth/login');
            return;
          }
        }

        // Clean up URL hash if implicit flow tokens (#access_token=...) are present
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // ── Step 2: Retrieve the now-established session ─────────────
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user?.id) {
          console.error('Session error:', sessionError);
          toast.error('Unable to verify your session. Please sign in again.');
          router.replace('/auth/login');
          return;
        }

        const user = session.user;

        // ── Step 3: Ensure a user_profile row exists ─────────────────
        // Retry up to 3 times to tolerate replication lag / RLS delays
        let profileRole: string | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData) {
            profileRole = profileData.role;
            break;
          }

          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }

        // First-time OAuth user — auto-create their profile
        if (profileRole === null) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User';

          const avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null;

          const { error: insertError } = await supabase.from('user_profiles').insert({
            id: user.id,
            email: user.email!,
            full_name: fullName,
            avatar_url: avatarUrl,
          });

          if (insertError) {
            console.error('Profile creation error:', insertError);
            // Non-fatal: profile may already exist due to a race condition
          }

          toast.success('Welcome to MyClientWork!');
          router.replace('/homepage');
          return;
        }

        // ── Step 4: Redirect based on role ───────────────────────────
        toast.success('Welcome back!');
        router.replace(profileRole === 'admin' ? '/admin' : '/homepage');
      } catch (err) {
        console.error('Auth callback error:', err);
        toast.error('Something went wrong during authentication. Please try again.');
        router.replace('/auth/login');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
