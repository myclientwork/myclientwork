'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Download, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { Product, Order } from '@/lib/types';

export function ProductPurchase({ product }: { product: Product }) {
  const { user, loading: authLoading } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOrder() {
      if (!user || !product) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('status', 'PAID')
        .maybeSingle();
      setExistingOrder(data as Order | null);
      setChecking(false);
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

  if (authLoading || checking) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const hasAccess = existingOrder?.status === 'PAID';

  return (
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

      {!user && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
          {' or '}
          <Link href="/auth/register" className="text-primary hover:underline">register</Link>
          {' to purchase.'}
        </p>
      )}
    </div>
  );
}
