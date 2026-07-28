'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider } from '@/lib/auth-context';
import type { UserProfile } from '@/lib/types';
import { AdminNav } from '@/shared/components/layout/admin-nav';

type AdminShellProps = {
  children: React.ReactNode;
  user: User;
  profile: UserProfile;
};

export function AdminShell({
  children,
  user,
  profile,
}: AdminShellProps) {
  const [adminOpen, setAdminOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAdminOpen(false);
  }, [pathname]);

  return (
    <AuthProvider initialUser={user} initialProfile={profile}>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-border/80 bg-card p-3 shadow-sm lg:hidden">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Admin Panel Menu</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminOpen((open) => !open)}
              aria-expanded={adminOpen}
              aria-controls="admin-mobile-navigation"
            >
              {adminOpen ? 'Close Menu' : 'Open Menu'}
            </Button>
          </div>

          {adminOpen && (
            <div
              id="admin-mobile-navigation"
              className="mb-4 rounded-xl border border-border/80 bg-card p-2 animate-in fade-in slide-in-from-top-2 lg:hidden"
            >
              <AdminNav />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:sticky lg:top-20 lg:block lg:h-fit">
              <div className="rounded-xl border border-border/60 bg-card shadow-sm">
                <AdminNav />
              </div>
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
