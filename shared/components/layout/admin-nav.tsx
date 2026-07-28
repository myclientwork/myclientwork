'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Mail,
  FolderKanban,
  UserCog,
  Shield,
  LogOut,
  FileCheck,
  Package,
  ShoppingCart,
  PenSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Client Requirements', icon: Briefcase },
  { href: '/admin/job-postings', label: 'Requirement Listings', icon: PenSquare },
  { href: '/admin/applications', label: 'Applications', icon: FileCheck },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/team', label: 'Team', icon: UserCog },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuth();

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="flex flex-col gap-1 p-3">
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-bold text-primary">Admin Panel</span>
      </div>
      {links.map((link) => {
        const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <div className="mt-auto pt-4 border-t border-border/60">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Admin: <span className="font-medium text-foreground">{profile?.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
