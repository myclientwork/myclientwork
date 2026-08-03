'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export function UserHeader() {
  const router = useRouter();
  const { user, profile, isAdmin, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.push('/auth/login');
  }

  const displayName = profile?.full_name || profile?.email || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Workspace Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md transition-transform duration-300 group-hover:scale-105">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-foreground">MyClientWork</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold text-primary border border-primary/20">
                  Workspace
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold">Dashboard Console</span>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                  {initial}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl p-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{displayName}</p>
                  <p className="text-[11px] leading-none text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium">
                <Link href="/dashboard/profile">Account Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium">
                <Link href="/dashboard/jobs">My Requirements</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-medium">
                <Link href="/dashboard/orders">My Orders</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/admin" className="font-bold text-primary flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Console
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive rounded-lg font-semibold"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
