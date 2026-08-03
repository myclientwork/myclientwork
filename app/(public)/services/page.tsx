import ServicesPageClient from '@/components/services/services-page-client';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Services',
  description:
    'Full-stack web development, mobile app engineering, cloud deployment, security audits, and API design — explore the professional services offered by MyClientWork.',
  path: '/services',
});

export default function ServicesPage() {
  return <ServicesPageClient />;
}
