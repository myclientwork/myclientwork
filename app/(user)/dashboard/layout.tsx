'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { DashboardNav } from '@/shared/components/layout/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close dashboard menu on path changes
  useEffect(() => {
    setDashboardOpen(false);
  }, [pathname]);

  // Listen to close event from main header navigation
  useEffect(() => {
    const handleCloseDashboard = () => setDashboardOpen(false);
    window.addEventListener('close-dashboard-drawer', handleCloseDashboard);
    return () => window.removeEventListener('close-dashboard-drawer', handleCloseDashboard);
  }, []);

  const toggleDashboard = () => {
    const nextState = !dashboardOpen;
    setDashboardOpen(nextState);
    if (nextState) {
      // Automatically close main navigation hamburger menu
      window.dispatchEvent(new CustomEvent('close-main-navigation'));
    }
  };

  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Mobile/Tablet Dashboard Menu bar */}
        <div className="lg:hidden flex items-center justify-between p-3 bg-card border border-border/80 rounded-xl mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Layout className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Dashboard Menu</span>
          </div>
          <Button variant="outline" size="sm" onClick={toggleDashboard}>
            {dashboardOpen ? 'Close Menu' : 'Open Menu'}
          </Button>
        </div>

        {/* Collapsible Dashboard Navigation list for mobile/tablet */}
        {dashboardOpen && (
          <div className="lg:hidden border border-border/80 bg-card rounded-xl p-4 mb-4 animate-fade-in">
            <DashboardNav />
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sidebar (Always visible on desktop screens, hidden on mobile/tablet) */}
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-fit">
            <DashboardNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
