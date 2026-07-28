'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function AdminBackLink() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Go to Dashboard
    </Link>
  );
}
