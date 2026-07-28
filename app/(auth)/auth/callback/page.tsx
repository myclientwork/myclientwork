'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const handledRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    function completeSignIn() {
      if (handledRef.current) return;
      handledRef.current = true;

      toast.success('Signed in successfully!');
      if (isMounted) {
        window.location.replace('/');
      }
    }

    async function processCallback() {
      if (handledRef.current) return;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error') || urlParams.get('error_description');

      // 1. Check for OAuth error in URL
      if (errorParam) {
        handledRef.current = true;
        console.error('OAuth callback error:', errorParam);
        toast.error(errorParam);
        window.location.replace('/auth/login');
        return;
      }

      // 2. If code parameter exists, exchange it for a session using client PKCE verifier
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session?.user) {
            completeSignIn();
            return;
          }
          if (error) {
            console.warn('Code exchange error:', error.message);
          }
        } catch (e) {
          console.warn('Code exchange exception:', e);
        }
      }

      // 3. Check if session already exists (e.g. detectSessionInUrl or existing session)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        completeSignIn();
        return;
      }

      // 4. Retry check up to 3 times (600ms max)
      for (let attempt = 0; attempt < 3; attempt++) {
        if (handledRef.current) return;
        await new Promise((r) => setTimeout(r, 200));
        const { data: { session: polledSession } } = await supabase.auth.getSession();
        if (polledSession?.user) {
          completeSignIn();
          return;
        }
      }

      // 5. If no session established, redirect to login
      if (!handledRef.current && isMounted) {
        handledRef.current = true;
        if (code) {
          toast.error('Authentication failed. Please try signing in again.');
        }
        window.location.replace('/auth/login');
      }
    }

    // Subscribe to auth state changes as immediate trigger
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !handledRef.current) {
        completeSignIn();
      }
    });

    processCallback();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
