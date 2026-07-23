import { AuthGuard } from '@/components/site/auth-guard';
import { DashboardNav } from '@/components/site/dashboard-nav';

export const metadata = {
  title: 'Dashboard',
  description: 'Your account dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <DashboardNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
