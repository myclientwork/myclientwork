'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { UserHeader } from '@/shared/components/layout/user-header';
import { DashboardNav } from '@/shared/components/layout/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Layout, X, ChevronDown } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col bg-background">
        {/* Dashboard Header */}
        <UserHeader />

        <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Mobile Dashboard Menu Toggle */}
          <div className="lg:hidden flex items-center justify-between p-3.5 bg-card/60 border border-border/60 rounded-2xl mb-5 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layout className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">Dashboard Menu</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className="rounded-xl font-semibold"
            >
              {dashboardOpen ? (
                <><X className="h-4 w-4 mr-1.5" /> Close</>
              ) : (
                <><ChevronDown className="h-4 w-4 mr-1.5" /> Open</>
              )}
            </Button>
          </div>

          {/* Collapsible Mobile Nav */}
          <AnimatePresence>
            {dashboardOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden border border-border/60 bg-card/60 rounded-2xl p-5 mb-5 backdrop-blur-xl shadow-sm overflow-hidden"
              >
                <DashboardNav />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-fit">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl shadow-sm">
                <DashboardNav />
              </div>
            </aside>
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
