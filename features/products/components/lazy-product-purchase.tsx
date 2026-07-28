'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ProductPurchase = dynamic(
  () =>
    import('@/features/products/components/product-purchase').then(
      (mod) => mod.ProductPurchase
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="mt-8 h-11 w-full" />,
  }
);

export function LazyProductPurchase(
  props: React.ComponentProps<typeof ProductPurchase>
) {
  return <ProductPurchase {...props} />;
}
