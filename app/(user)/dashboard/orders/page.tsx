'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Download, Loader2, ArrowUpRight } from 'lucide-react';
import { UserBackLink } from '@/shared/components/layout/user-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { fadeIn, staggerContainer } from '@/lib/motion';

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

  const statusVariantClass = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'FAILED': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'REFUNDED': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <UserBackLink />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-xs text-muted-foreground font-medium">
          View your transaction history and instant product access licenses.
        </p>
      </div>

      {loading ? (
        <Card className="rounded-2xl border-border/60 bg-card/60 p-12 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : orders.length === 0 ? (
        <Card className="rounded-2xl border-border/60 bg-card/60 p-12 text-center backdrop-blur-xl">
          <CardContent className="flex flex-col items-center p-0">
            <Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-bold text-foreground">No digital product orders yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Browse our digital products store to purchase ready-to-deploy systems.</p>
            <Button asChild className="mt-5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <Link href="/products">Browse Digital Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {orders.map((order, i) => (
            <motion.div key={order.id} variants={fadeIn('up', i * 0.05, 0.4)}>
              <Card className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    {order.products?.image_url ? (
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border shadow-sm flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={order.products.image_url} alt={order.products.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <Link href={`/products/${order.products.slug}`} className="font-bold text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                        {order.products?.name || 'Digital Product Asset'}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        ${(order.amount_cents / 100).toFixed(2)} {order.currency} · Purchased {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusVariantClass(order.status)}`}>
                      {order.status}
                    </Badge>
                    {order.status === 'PAID' && (
                      <Button asChild size="sm" className="rounded-xl font-bold bg-primary text-primary-foreground shadow-md">
                        <Link href={`/products/${order.products.slug}`}>
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Access
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
