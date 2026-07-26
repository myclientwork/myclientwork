'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Linkedin, Github, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function SiteFooter() {
  const { user, loading } = useAuth();

  return (
    <footer className="border-t border-border/50 bg-card/80 backdrop-blur-md text-card-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl group">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/30 transition-transform group-hover:scale-105">
                <Image
                  src="/images/1784378767326_(1).png"
                  alt="MyClientWork"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                  MCW
                </div>
              </div>
              <div className="flex flex-col">
                <span className="block text-base font-extrabold leading-tight tracking-tight">
                  My<span className="text-primary">client</span>work
                </span>
                <span className="block text-[9px] font-semibold leading-tight text-muted-foreground tracking-wider uppercase">
                  Digital Services
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Production-grade web application platform for digital agencies and clients. We turn complex project requirements into high-performance software.
            </p>
            <div className="flex gap-2 pt-2">
              <a
                href="mailto:myclientwork3@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground transition-colors hover:text-primary">
                  Portfolio Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Products</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/products" className="text-muted-foreground transition-colors hover:text-primary">
                  Digital Products
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-muted-foreground transition-colors hover:text-primary">
                  Engineering Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a
                  href="mailto:myclientwork3@gmail.com"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  <span className="truncate">myclientwork3@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+977981621091"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  <span>+977-981621091</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+9779811138552"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  <span>+977-9811138552</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} MyClientWork. Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Full-Stack Team.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
