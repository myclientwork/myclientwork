import { supabase } from '@/lib/supabase';
import type { ProjectWithMembers, Member } from '@/lib/types';
import { HeroSection } from '@/components/hero-section';
import { TechMarquee } from '@/components/home/tech-marquee';
import { StatsSection } from '@/components/home/stats-section';
import { ServicesSection } from '@/components/home/services-section';
import { FeaturedProjectsSection } from '@/components/home/featured-projects-section';
import { TeamSection } from '@/components/home/team-section';
import { CtaSection } from '@/components/home/cta-section';

export const revalidate = 60;

async function getHomeData() {
  try {
    const [projectsRes, membersRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, slug, category, short_summary, cover_image_url, technologies')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .order('display_order', { ascending: true })
        .limit(3),
      supabase
        .from('members')
        .select('id, full_name, slug, title, bio, avatar_url, skills')
        .order('display_order', { ascending: true }),
    ]);

    return {
      projects: (projectsRes.data as unknown as ProjectWithMembers[]) ?? [],
      members: (membersRes.data as Member[]) ?? [],
    };
  } catch {
    return { projects: [], members: [] };
  }
}

export default async function HomePage() {
  const { projects, members } = await getHomeData();

  return (
    <div className="relative overflow-hidden bg-background">
      {/* World-Class AI Hero Section */}
      <HeroSection />

      {/* Infinite Tech & Capabilities Ticker */}
      <TechMarquee />

      {/* Stats Counter Section */}
      <StatsSection />

      {/* Core Expertise / Services Section */}
      <ServicesSection />

      {/* Featured Projects Portfolio */}
      <FeaturedProjectsSection projects={projects} />

      {/* Freelancers & Engineering Team */}
      <TeamSection members={members} />

      {/* High-Impact CTA Banner */}
      <CtaSection />
    </div>
  );
}
