'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ApplyForm = dynamic(
  () =>
    import('@/features/jobs/components/apply-form').then(
      (mod) => mod.ApplyForm
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ),
  }
);

export function LazyApplyForm(
  props: React.ComponentProps<typeof ApplyForm>
) {
  return <ApplyForm {...props} />;
}
