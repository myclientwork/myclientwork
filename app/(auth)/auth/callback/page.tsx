'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user?.id) {
        router.push('/auth/login');
        return;
      }

      const user = session.user;

      // Check if profile exists (handles both email and OAuth sign-ups)
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      // First-time OAuth sign-up — auto-create profile
      if (!profileData) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User';

        await supabase.from('user_profiles').upsert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
        }, { onConflict: 'id', ignoreDuplicates: true });

        router.push('/dashboard');
        return;
      }

      router.push(profileData.role === 'admin' ? '/admin' : '/dashboard');
    });
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}

