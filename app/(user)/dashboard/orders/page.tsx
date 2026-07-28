'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Download, Loader2 } from 'lucide-react';
import { UserBackLink } from '@/shared/components/layout/user-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { OrderWithProduct } from '@/lib/types';

type UserOrder = {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  products: { id: string; name: string; slug: string; image_url: string | null };
};

export default function DashboardOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      const { data } = await supabase
        .from('orders')
        .select('*, products(id, name, slug, image_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders((data as UserOrder[]) ?? []);
      setLoading(false);
    }
    loadOrders();
  }, [user]);

  const statusVariant = (status: string) => {
    switch (status) {
      case 'PAID': return 'default';
      case 'PENDING': return 'secondary';
      case 'FAILED': return 'destructive';
      case 'REFUNDED': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <UserBackLink />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-muted-foreground">View your purchase history and download products.</p>
      </div>

      {loading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        </CardContent></Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No orders yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse our products to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {order.products?.image_url ? (
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={order.products.image_url} alt={order.products.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Link href={`/products/${order.products.slug}`} className="font-medium hover:underline">
                      {order.products?.name || 'Unknown product'}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${(order.amount_cents / 100).toFixed(2)} {order.currency} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  {order.status === 'PAID' && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/products/${order.products.slug}`}>
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
