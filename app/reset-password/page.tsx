'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function StandaloneResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [ready, setReady] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initRecoveryCheck() {
      if (typeof window === 'undefined') return;

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const hash = window.location.hash;

      // 1. If PKCE authorization code parameter exists, exchange code for session
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session && !error) {
            if (isMounted) {
              setHasValidToken(true);
              setReady(true);
            }
            return;
          }
        } catch (err) {
          console.warn('PKCE code exchange error on reset-password:', err);
        }
      }

      // 2. Check for hash parameters (implicit flow type=recovery)
      if (hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
        if (isMounted) {
          setHasValidToken(true);
          setReady(true);
        }
        return;
      }

      // 3. Check for existing active recovery session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        setHasValidToken(true);
      } else if (isMounted) {
        setHasValidToken(false);
      }

      if (isMounted) setReady(true);
    }

    initRecoveryCheck();

    // Subscribe to PASSWORD_RECOVERY auth state change events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && window.location.pathname.startsWith('/reset-password'))) {
        if (isMounted) {
          setHasValidToken(true);
          setReady(true);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Your password has been updated successfully!');

      // Sign out temporary recovery session
      await supabase.auth.signOut().catch(() => {});

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Update password error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-3 flex items-center justify-center gap-2.5 group w-fit">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/30 transition-transform group-hover:scale-105">
              <Image
                src="/images/1784378767326_(1).png"
                alt="MyClientWork"
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                MCW
              </div>
            </div>
          </Link>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter a new secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Password Reset Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Your password has been updated. Redirecting you to the sign in page...
              </p>
              <Button className="w-full mt-2" onClick={() => router.push('/auth/login')}>
                Sign In Now
              </Button>
            </div>
          ) : !hasValidToken ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Invalid or Expired Link</h3>
              <p className="text-sm text-muted-foreground">
                This password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <Button className="w-full mt-2" asChild>
                <Link href="/auth/forgot-password">
                  <KeyRound className="mr-2 h-4 w-4" /> Request New Reset Link
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Updating password...' : 'Update Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
