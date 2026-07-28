'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Briefcase,
  Code2,
  Sparkles,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useSiteSettings } from '@/shared/context/settings-context';
import { toast } from 'sonner';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);

  const logoSrc = settings.logo_url || '/images/1784378767326_(1).png';
  const siteName = settings.site_name || 'MyClientWork';
  const siteTagline = settings.site_tagline || 'Digital Services';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const activeNavLinks = navLinks;

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/');
    router.refresh();
  }

  // Prevent background scrolling while mobile navigation drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Listen to close-main-navigation custom event
  useEffect(() => {
    const handleCloseMain = () => setOpen(false);
    window.addEventListener('close-main-navigation', handleCloseMain);
    return () => window.removeEventListener('close-main-navigation', handleCloseMain);
  }, []);

  // Close main navigation drawer when Esc key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close main navigation drawer on path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      // Automatically close Dashboard menu/drawer on mobile
      window.dispatchEvent(new CustomEvent('close-dashboard-drawer'));
    }
  };

  // Extract avatar URL if present from Google metadata or user profile
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Left: Logo + Company Name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/30 transition-transform group-hover:scale-105">
            <Image
              src={logoSrc}
              alt={siteName}
              fill
              className="object-cover"
              priority
              unoptimized={logoSrc.startsWith('data:')}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
              {siteName.charAt(0)}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="block text-sm sm:text-base font-extrabold leading-tight tracking-tight">
              {siteName}
            </span>
            <span className="block text-[8px] sm:text-[9px] font-semibold leading-tight text-muted-foreground tracking-wider uppercase">
              {siteTagline}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2.5">
          {activeNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 lg:px-3.5 lg:text-sm',
                isActive(link.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Theme Toggle + Profile User Icon Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-muted/60" />
          ) : user ? (
            /* Authenticated User Profile Dropdown Menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-border/80 rounded-full pl-1.5 pr-3 hover:bg-accent shadow-sm"
                  aria-label="User profile menu"
                >
                  {/* Avatar Profile Icon */}
                  {avatarUrl ? (
                    <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-primary/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt="User profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      {userInitial}
                    </div>
                  )}
                  
                  <span className="hidden lg:inline-block max-w-[100px] truncate text-xs font-semibold">
                    {displayName}
                  </span>

                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3 py-1">
                    {avatarUrl ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-primary/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {userInitial}
                      </div>
                    )}
                    <div className="flex flex-col space-y-0.5 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                          <Shield className="h-2.5 w-2.5" />
                          Admin Role
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Dropdown Links based on Role */}
                {isAdmin ? (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin" className="flex items-center gap-2 text-primary font-semibold">
                      <Shield className="h-4 w-4" />
                      Admin Control Panel
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2 font-medium">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/jobs" className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        My Requirements
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Guest User Profile Icon Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full px-2.5 border-border/80 shadow-sm hover:bg-accent"
                  aria-label="Guest profile menu"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold">Account</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 shadow-lg">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">
                  Welcome Guest
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/auth/login" className="flex items-center gap-2 font-medium">
                    <LogIn className="h-4 w-4 text-primary" />
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/auth/register" className="flex items-center gap-2 font-medium">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Hamburger Toggle (hidden on desktop md:hidden) */}
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-accent md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Semi-transparent Backdrop overlay that closes the menu when tapped outside */}
      <div
        className={cn(
          'fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer Panel */}
      <div
        className={cn(
          'fixed left-0 right-0 top-16 z-50 border-b border-border/60 bg-background/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out shadow-2xl',
          open
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {activeNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200',
                isActive(link.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
