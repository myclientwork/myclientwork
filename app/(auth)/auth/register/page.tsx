'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAuthCallbackUrl } from '@/shared/config/supabase';
import { useAuth } from '@/lib/auth-context';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function RegisterPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm: '',
  });

  useEffect(() => {
    if (user && profile) {
      router.push(profile.role === 'admin' ? '/admin' : '/');
    }
  }, [user, profile, router]);

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthCallbackUrl(),
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign up with Google.');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = form.full_name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const trimmedPassword = form.password;
    const trimmedConfirm = form.confirm;

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Full name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: { data: { full_name: trimmedName } },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        if (msg.includes('password') && msg.includes('weak')) {
          throw new Error('Password is too weak. Please use a stronger password with at least 6 characters.');
        }
        if (msg.includes('too many requests') || msg.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a moment and try again.');
        }
        throw error;
      }

      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        toast.success(
          'An account with this email already exists. Please sign in or check your email for a confirmation link.',
          { duration: 5000 }
        );
        router.push('/auth/login');
        return;
      }

      if (data.session) {
        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedName,
          });
        }
        toast.success('Account created! Welcome to MyClientWork.');
        router.push('/');
      } else if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: trimmedEmail,
          full_name: trimmedName,
        });

        toast.success(
          'Account created! Please check your email to verify your account before signing in.',
          { duration: 5000 }
        );
        router.push('/auth/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuroraBackground className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="w-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="text-center pb-4">
            <Link href="/" className="mx-auto mb-3 flex items-center justify-center gap-2.5 group w-fit">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
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
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-black text-xs">
                  MCW
                </div>
              </div>
            </Link>
            <CardTitle className="text-2xl font-black text-foreground tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">Sign up to post requirements and track project milestones</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 rounded-xl border-border/80 bg-background/60 backdrop-blur-xl font-bold shadow-sm hover:border-primary/40 hover:bg-accent/80 transition-all"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-card/90 px-3 text-muted-foreground">Or email sign up</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs font-bold text-foreground">Full Name</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="rounded-xl border-border/80 bg-background/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="rounded-xl border-border/80 bg-background/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    required
                    className="pr-10 rounded-xl border-border/80 bg-background/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs font-bold text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Re-enter password"
                    required
                    className="pr-10 rounded-xl border-border/80 bg-background/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground font-medium pt-1">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                <span>
                  By creating an account you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:text-cyan-400 transition-colors">Terms</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:text-cyan-400 transition-colors">Privacy Policy</Link>.
                </span>
              </div>
              <Button type="submit" className="w-full rounded-xl font-bold shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:scale-[1.01] transition-transform" disabled={loading || googleLoading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="mt-5 text-center text-xs text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-primary hover:text-cyan-400 transition-colors">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
}
