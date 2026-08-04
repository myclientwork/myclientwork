'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Code2, ArrowUpRight, Bus, ShieldCheck, Layers, Server } from 'lucide-react';
import type { ProjectWithMembers } from '@/lib/types';

interface ProjectCardImageProps {
  project: ProjectWithMembers;
}

export function ProjectCardImage({ project }: ProjectCardImageProps) {
  const [imageError, setImageError] = useState(false);

  // Custom curated fallback banners based on slug
  const getFallbackGraphics = (slug: string) => {
    if (slug === 'kiitgo') {
      return (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 p-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-3 animate-pulse">
            <Bus className="h-7 w-7" aria-hidden="true" />
          </div>
          <span className="relative z-10 text-sm font-black text-white tracking-wide">
            KIITGO Smart Transit System
          </span>
          <span className="relative z-10 text-[10px] font-mono text-cyan-300 font-semibold mt-1 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            5,000+ Active Users · Sub-100ms API
          </span>
        </div>
      );
    }

    if (slug === 'taskflow') {
      return (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/40 shadow-xl shadow-blue-500/10 mb-3 animate-pulse">
            <Layers className="h-7 w-7" aria-hidden="true" />
          </div>
          <span className="relative z-10 text-sm font-black text-white tracking-wide">
            TaskFlow Project Management
          </span>
          <span className="relative z-10 text-[10px] font-mono text-blue-300 font-semibold mt-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Kanban &amp; RBAC Portal
          </span>
        </div>
      );
    }

    if (slug === 'securedrive') {
      return (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 p-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10 mb-3 animate-pulse">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <span className="relative z-10 text-sm font-black text-white tracking-wide">
            SecureDrive Cloud Storage
          </span>
          <span className="relative z-10 text-[10px] font-mono text-emerald-300 font-semibold mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            AES-GCM Client Encryption
          </span>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="relative aspect-video w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-2">
          <Code2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="relative z-10 text-xs font-bold text-slate-200">
          {project.title}
        </span>
      </div>
    );
  };

  if (!project.cover_image_url || imageError) {
    return getFallbackGraphics(project.slug);
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-muted">
      <Image
        src={project.cover_image_url}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setImageError(true)}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" aria-hidden="true" />
      <div className="absolute top-3 right-3 rounded-full bg-slate-950/70 p-2 backdrop-blur-md text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  );
}
