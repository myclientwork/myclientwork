import { PageLoadingSkeleton } from '@/components/page-loading-skeleton';

export default function DashboardLoading() {
  return <PageLoadingSkeleton cards={3} rows={4} />;
}
