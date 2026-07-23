import { AdminGuard } from '@/components/site/admin-guard';
import { AdminNav } from '@/components/site/admin-nav';

export const metadata = {
  title: 'Admin Panel',
  description: 'Administrative dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="lg:sticky lg:top-20 lg:h-fit">
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
