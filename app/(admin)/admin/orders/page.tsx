'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { DataPagination } from '@/components/data-pagination';

type AdminOrder = {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  products: { id: string; name: string; slug: string; image_url: string | null };
  user_profiles: { id: string; email: string; full_name: string | null };
};

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase
      .from('orders')
      .select(
        'id, amount_cents, currency, status, created_at, updated_at, products(id, name, slug, image_url), user_profiles(id, email, full_name)',
        { count: 'exact' }
      );

    if (statusFilter !== 'ALL') query = query.eq('status', statusFilter);

    const [ordersResult, statsResult] = await Promise.all([
      query.order('created_at', { ascending: false }).range(from, to),
      supabase.from('orders').select('amount_cents, status'),
    ]);

    if (ordersResult.error || statsResult.error) {
      toast.error('Failed to load orders');
      setLoading(false);
      return;
    }

    const stats = statsResult.data ?? [];
    setOrders((ordersResult.data as unknown as AdminOrder[]) ?? []);
    setTotalCount(ordersResult.count ?? 0);
    setTotalOrders(stats.length);
    setTotalRevenue(
      stats
        .filter((order) => order.status === 'PAID')
        .reduce((sum, order) => sum + order.amount_cents, 0)
    );
    setPendingCount(stats.filter((order) => order.status === 'PENDING').length);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      await loadOrders();
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  }

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all customer orders. {totalOrders} total orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3" aria-label="Loading orders">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {order.products?.image_url ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={order.products.image_url}
                        alt={order.products.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{order.products?.name || 'Unknown product'}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user_profiles?.email || 'Unknown user'} · ${(order.amount_cents / 100).toFixed(2)} {order.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  {updatingId === order.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateStatus(order.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DataPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
