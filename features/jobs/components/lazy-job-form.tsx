'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobForm = dynamic(
  () => import('@/features/jobs/components/job-form').then((mod) => mod.JobForm),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-11 w-36" />
        </CardContent>
      </Card>
    ),
  }
);

export function LazyJobForm() {
  return <JobForm />;
}
