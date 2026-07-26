'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/features/auth/components/admin-guard';
import { AdminNav } from '@/shared/components/layout/admin-nav';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminOpen, setAdminOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAdminOpen(false);
  }, [pathname]);

  return (
    <AdminGuard>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Mobile/Tablet Admin Menu Bar */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-card border border-border/80 rounded-xl mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Admin Panel Menu</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAdminOpen(!adminOpen)}>
              {adminOpen ? 'Close Menu' : 'Open Menu'}
            </Button>
          </div>

          {/* Collapsible Admin Navigation for mobile/tablet */}
          {adminOpen && (
            <div className="lg:hidden border border-border/80 bg-card rounded-xl p-2 mb-4 animate-fade-in">
              <AdminNav />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-fit">
              <div className="rounded-xl border border-border/60 bg-card shadow-sm">
                <AdminNav />
              </div>
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
