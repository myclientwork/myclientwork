'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  User,
  Shield,
  LogOut,
  FileCheck,
  Package,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, signOut, profile } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/post-a-job', label: 'Post Requirement', icon: FileCheck },
    { href: '/dashboard/jobs', label: 'My Requirements', icon: Briefcase },
    { href: '/dashboard/orders', label: 'My Orders', icon: Package },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="flex flex-col gap-1.5">
      <div className="mb-3 px-3 py-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80">
          My Workspace
        </p>
      </div>
      {links.map((link) => {
        const active = link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
            )}
          >
            <link.icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{link.label}</span>
            {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
        >
          <Shield className="h-4 w-4" />
          Admin Panel
        </Link>
      )}
      <div className="mt-auto pt-5 border-t border-border/60">
        <div className="px-3 py-2 text-[11px] text-muted-foreground">
          Signed in as
          <br />
          <span className="font-bold text-foreground">{profile?.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
