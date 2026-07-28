'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider } from '@/lib/auth-context';
import type { UserProfile } from '@/lib/types';
import { DashboardNav } from '@/shared/components/layout/dashboard-nav';

type DashboardShellProps = {
  children: React.ReactNode;
  user: User;
  profile: UserProfile | null;
};

export function DashboardShell({
  children,
  user,
  profile,
}: DashboardShellProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDashboardOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleCloseDashboard = () => setDashboardOpen(false);
    window.addEventListener('close-dashboard-drawer', handleCloseDashboard);
    return () =>
      window.removeEventListener(
        'close-dashboard-drawer',
        handleCloseDashboard
      );
  }, []);

  const toggleDashboard = () => {
    const nextState = !dashboardOpen;
    setDashboardOpen(nextState);
    if (nextState) {
      window.dispatchEvent(new CustomEvent('close-main-navigation'));
    }
  };

  return (
    <AuthProvider initialUser={user} initialProfile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border/80 bg-card p-3 shadow-sm lg:hidden">
          <div className="flex items-center gap-2">
            <Layout className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Dashboard Menu</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDashboard}
            aria-expanded={dashboardOpen}
            aria-controls="dashboard-mobile-navigation"
          >
            {dashboardOpen ? 'Close Menu' : 'Open Menu'}
          </Button>
        </div>

        {dashboardOpen && (
          <div
            id="dashboard-mobile-navigation"
            className="mb-4 rounded-xl border border-border/80 bg-card p-4 animate-in fade-in slide-in-from-top-2 lg:hidden"
          >
            <DashboardNav />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:sticky lg:top-20 lg:block lg:h-fit">
            <DashboardNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
