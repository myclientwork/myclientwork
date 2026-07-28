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
  Package,
  ShoppingCart,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    label: 'Main',
    links: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/jobs', label: 'Client Requirements', icon: Briefcase },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/messages', label: 'Messages', icon: Mail },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/team', label: 'Team Members', icon: UserCog },
    ],
  },
  {
    label: 'Commerce',
    links: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    ],
  },
  {
    label: 'System',
    links: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navSections.map((section, sIdx) => (
        <div key={section.label} className={cn(sIdx > 0 && 'mt-4')}>
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            {section.label}
          </p>
          {section.links.map((link) => {
            const active =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
