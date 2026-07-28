'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mail, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DataPagination } from '@/components/data-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { supabase } from '@/lib/supabase';
import type { ContactMessage } from '@/lib/types';

const PAGE_SIZE = 10;

function sanitizeSearchTerm(value: string) {
  return value.trim().replace(/[%_,().]/g, ' ');
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedSearch = useDebouncedValue(search);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const normalizedSearch = sanitizeSearchTerm(debouncedSearch);

    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' });

    if (normalizedSearch) {
      query = query.or(
        `name.ilike.%${normalizedSearch}%,email.ilike.%${normalizedSearch}%,subject.ilike.%${normalizedSearch}%`
      );
    }

    const { data, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    setMessages((data as ContactMessage[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [debouncedSearch, page]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Contact form submissions. {totalCount} matching messages.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading messages">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">No messages found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{msg.subject}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      From: <span className="font-medium">{msg.name}</span> ({msg.email})
                    </p>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-line">{msg.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
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
