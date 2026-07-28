import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type PageLoadingSkeletonProps = {
  cards?: number;
  rows?: number;
  className?: string;
};

export function PageLoadingSkeleton({
  cards = 4,
  rows = 5,
  className,
}: PageLoadingSkeletonProps) {
  return (
    <div
      className={cn('space-y-8', className)}
      role="status"
      aria-label="Loading page content"
      aria-busy="true"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-52 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 p-5">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-5">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-3 w-72 max-w-full" />
              </div>
              <Skeleton className="hidden h-7 w-20 sm:block" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
