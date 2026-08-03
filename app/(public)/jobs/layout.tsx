import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Job Openings',
  description:
    'Explore current job openings and freelance opportunities at MyClientWork. Apply for full-stack engineering, design, security, and DevOps roles.',
  path: '/jobs',
});

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
