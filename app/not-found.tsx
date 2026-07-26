import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">404</h1>
      <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        Sorry, we couldn&apos;t find the page you are looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
