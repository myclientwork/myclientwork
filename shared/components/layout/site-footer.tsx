'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSiteSettings } from '@/shared/context/settings-context';

export function SiteFooter() {
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const logoSrc = settings.logo_url || '/images/1784378767326_(1).png';
  const siteName = settings.site_name || 'MyClientWork';
  const siteTagline = settings.site_tagline || 'AI Freelance Platform';
  const contactEmail = settings.contact_email || 'myclientwork3@gmail.com';

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-slate-950/80 backdrop-blur-xl text-slate-200 transition-colors">
      {/* Dynamic Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-mask opacity-30" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-t from-indigo-500/10 via-cyan-500/10 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-black text-xl group">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logoSrc}
                  alt={siteName}
                  fill
                  className="object-cover"
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
                <span className="block text-base font-black leading-tight tracking-tight text-white group-hover:text-primary transition-colors">
                  {siteName}
                </span>
                <span className="block text-[9px] font-bold leading-tight text-primary/80 tracking-widest uppercase">
                  {siteTagline}
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              World-class AI-powered freelancing and client collaboration platform. We match top enterprise talent with complex project requirements effortlessly.
            </p>
            <div className="flex gap-2.5 pt-2">
              <a
                href={`mailto:${contactEmail}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 hover:scale-105"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 hover:scale-105"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400 hover:scale-105"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Platform</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 transition-colors hover:text-cyan-400">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Capabilities &amp; Tech
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Client Projects Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Team */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Ecosystem</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/products" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Digital Products
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Freelance Experts
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-slate-400 transition-colors hover:text-cyan-400">
                  Post Requirement
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support Contact */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Contact Support</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                  <span className="truncate">{contactEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+977981621091"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                  <span>+977-981621091</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+9779811138552"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                  <span>+977-9811138552</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & micro info */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p className="flex items-center gap-1.5 font-medium">
            &copy; {new Date().getFullYear()} {siteName}. Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline animate-pulse" /> by Engineering Team.
          </p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="transition-colors hover:text-cyan-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cyan-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
