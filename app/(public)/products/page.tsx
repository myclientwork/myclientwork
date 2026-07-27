import Link from 'next/link';
import { Package, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export const revalidate = 60;

export const metadata = {
  title: 'Software Products',
  description: 'Browse our collection of premium software products. Instant access after purchase.',
};

async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price_cents, currency, description, features, image_url')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });
  return (data as Product[]) ?? [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Software Products</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Browse our collection of premium software products. Instant access after purchase.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <Package className="h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No products available yet.</p>
          <p className="mt-1 text-muted-foreground">Check back soon for new releases.</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
              {product.image_url ? (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-secondary">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-2xl font-bold text-primary">
                  ${(product.price_cents / 100).toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground"> {product.currency}</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                {product.features.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <Button asChild className="mt-6 w-full">
                  <Link href={`/products/${product.slug}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
