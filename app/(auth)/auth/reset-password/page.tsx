'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LegacyResetPasswordRedirectPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(`/reset-password${window.location.search}${window.location.hash}`);
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
