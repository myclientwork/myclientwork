import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteFooter } from '@/shared/components/layout/site-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
