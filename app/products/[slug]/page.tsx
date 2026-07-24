'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Package, Check, ArrowLeft, Loader2, Download, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { Product, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      setProduct(data as Product | null);
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    async function checkOrder() {
      if (!user || !product) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('status', 'PAID')
        .maybeSingle();
      setExistingOrder(data as Order | null);
    }
    checkOrder();
  }, [user, product]);

  async function handlePurchase() {
    if (!user) {
      toast.error('Please sign in to purchase.');
      return;
    }
    if (!product) return;
    setPurchasing(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_id: product.id,
          amount_cents: product.price_cents,
          currency: product.currency,
          status: 'PENDING',
        })
        .select()
        .single();
      if (error) throw error;
      toast.success('Order created! Complete payment to get access.');
      setExistingOrder(data as Order);
    } catch {
      toast.error('Failed to create order');
    } finally {
      setPurchasing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  const hasAccess = existingOrder?.status === 'PAID';

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
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
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

          <div className="mt-8">
            {hasAccess ? (
              <div className="space-y-3">
                <Badge className="text-sm">Purchased</Badge>
                {product.download_url && (
                  <Button asChild className="w-full" size="lg">
                    <a href={product.download_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-5 w-5" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            ) : existingOrder ? (
              <div className="space-y-3">
                <Badge variant="secondary" className="text-sm">Order: {existingOrder.status}</Badge>
                <p className="text-sm text-muted-foreground">
                  Your order is being processed. You&apos;ll get access once payment is confirmed.
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={purchasing || !user}
              >
                {purchasing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                {purchasing ? 'Processing...' : user ? 'Buy Now' : 'Sign in to Buy'}
              </Button>
            )}
          </div>

          {!user && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
              {' or '}
              <Link href="/auth/register" className="text-primary hover:underline">register</Link>
              {' to purchase.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
