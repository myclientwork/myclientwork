import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Package, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { LazyProductPurchase } from '@/features/products/components/lazy-product-purchase';
import type { Product } from '@/lib/types';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('status', 'PUBLISHED');
    return products?.map((p) => ({ slug: p.slug })) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

async function getProduct(slug: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data as Product | null;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {product.image_url ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-secondary">
              <Package className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-3 text-3xl font-bold text-primary">
            ${(product.price_cents / 100).toFixed(2)}
            <span className="text-base font-normal text-muted-foreground"> {product.currency}</span>
          </p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {product.features.length > 0 && (
            <ul className="mt-6 space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Interactive checkout action */}
          <LazyProductPurchase product={product} />
        </div>
      </div>
    </div>
  );
}
