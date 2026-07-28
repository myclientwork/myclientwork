'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { UserHeader } from '@/shared/components/layout/user-header';
import { DashboardNav } from '@/shared/components/layout/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    setDashboardOpen(false);
  }, [pathname]);

  // Restrict Admin users from accessing client dashboard — redirect directly to /admin
  useEffect(() => {
    if (!loading && profile?.role === 'admin') {
      router.replace('/admin');
    }
  }, [profile, loading, router]);

  if (!loading && profile?.role === 'admin') {
    return null;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-muted/20">
        {/* Dedicated Isolated User Dashboard Header */}
        <UserHeader />

        <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile/Tablet Dashboard Menu bar */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-card border border-border/80 rounded-xl mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Dashboard Navigation</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDashboardOpen(!dashboardOpen)}>
              {dashboardOpen ? 'Close Menu' : 'Open Menu'}
            </Button>
          </div>

          {/* Collapsible Dashboard Navigation list for mobile/tablet */}
          {dashboardOpen && (
            <div className="lg:hidden border border-border/80 bg-card rounded-xl p-4 mb-4 animate-fade-in shadow-sm">
              <DashboardNav />
            </div>
          )}

          {/* Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-fit">
              <DashboardNav />
            </aside>
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
