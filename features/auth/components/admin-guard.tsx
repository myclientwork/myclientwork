'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (profile?.role !== 'admin') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your account (<span className="font-semibold text-foreground">{user.email}</span>) does not have admin privileges.
          Please contact the site administrator if you believe this is an error.
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
