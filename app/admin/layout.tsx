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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <AdminNav />
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
