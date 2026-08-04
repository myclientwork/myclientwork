'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
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
  const [scrolled, setScrolled] = useState(false);

  const logoSrc = settings.logo_url || '/images/1784378767326_(1).png';
  const siteName = settings.site_name || 'MyClientWork';
  const siteTagline = settings.site_tagline || 'AI-Powered Platform';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/');
    router.refresh();
  }

  // Handle scroll backdrop effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling while mobile menu open
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

  // Close navigation drawer on path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-xl shadow-black/5'
          : 'bg-background/40 backdrop-blur-md border-b border-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo + Branding */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105 group-hover:ring-primary">
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
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-extrabold text-xs">
              {siteName.charAt(0)}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="block text-sm sm:text-base font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
              {siteName}
            </span>
            <span className="block text-[8px] sm:text-[9px] font-bold leading-tight text-primary/80 tracking-widest uppercase">
              {siteTagline}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar with Floating Active Pill */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-background/50 p-1 backdrop-blur-lg">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 lg:text-sm',
                  active
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-primary/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle + User Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-muted/60" />
          ) : user ? (
            /* User Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-border/80 rounded-full pl-1.5 pr-3 hover:border-primary/40 hover:bg-accent/60 shadow-sm"
                  aria-label="User profile menu"
                >
                  {avatarUrl ? (
                    <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-primary/40">
                      <Image
                        src={avatarUrl}
                        alt="User profile"
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                        unoptimized
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

                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3 py-1">
                    {avatarUrl ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-primary/30">
                        <Image src={avatarUrl} alt="Avatar" width={36} height={36} className="h-full w-full object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {userInitial}
                      </div>
                    )}
                    <div className="flex flex-col space-y-0.5 min-w-0">
                      <p className="text-sm font-bold leading-none truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold text-primary">
                          <Shield className="h-2.5 w-2.5" />
                          Admin Role
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {isAdmin ? (
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                    <Link href="/admin" className="flex items-center gap-2 text-primary font-bold">
                      <Shield className="h-4 w-4" />
                      Admin Control Panel
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/dashboard" className="flex items-center gap-2 font-medium">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/dashboard/profile" className="flex items-center gap-2 font-medium">
                        <User className="h-4 w-4 text-primary" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/dashboard/jobs" className="flex items-center gap-2 font-medium">
                        <Settings className="h-4 w-4 text-primary" />
                        My Requirements
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive rounded-lg font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Guest Account Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full px-3 border-border/80 shadow-sm hover:bg-accent hover:border-primary/40"
                  aria-label="Guest profile menu"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold">Account</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 shadow-2xl rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-bold">
                  Welcome Guest
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link href="/auth/login" className="flex items-center gap-2 font-semibold">
                    <LogIn className="h-4 w-4 text-primary" />
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link href="/auth/register" className="flex items-center gap-2 font-semibold">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Hamburger Trigger */}
          <button
            className="inline-flex items-center justify-center rounded-xl p-2 text-foreground hover:bg-accent/80 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle mobile menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-16 z-50 border-b border-border/80 bg-background/95 backdrop-blur-2xl md:hidden shadow-2xl"
            >
              <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-4 sm:px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
