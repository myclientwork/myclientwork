import { PageLoadingSkeleton } from '@/components/page-loading-skeleton';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageLoadingSkeleton cards={3} rows={3} />
    </div>
  );
}
