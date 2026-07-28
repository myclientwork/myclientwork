'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteFooter } from '@/shared/components/layout/site-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile?.role === 'admin') {
      router.replace('/admin');
    }
  }, [profile, loading, router]);

  // Block rendering public website for Admin users to enforce strict Admin Console isolation
  if (!loading && profile?.role === 'admin') {
    return null;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
