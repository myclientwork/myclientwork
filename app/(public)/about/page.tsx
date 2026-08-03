import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { AboutPageClient } from '@/components/about/about-page-client';
import { createPageMetadata } from '@/lib/seo';

export const revalidate = 60;

async function getMembers() {
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('display_order', { ascending: true });
  return (data as Member[]) ?? [];
}

export const metadata = createPageMetadata({
  title: 'About Us',
  description:
    'Meet the team behind MyClientWork — full-stack engineers, security specialists, and cloud architects building production-grade digital solutions for businesses worldwide.',
  path: '/about',
});

export default async function AboutPage() {
  const members = await getMembers();

  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Story
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl text-foreground">
              About MyClientWork
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We are a team of full-stack developers from KIIT University with
              hands-on experience building production-grade web applications
              used by thousands of real users. Our mission is to turn ideas into
              clean, working products.
            </p>
          </div>
        </div>
      </AuroraBackground>

      <AboutPageClient members={members} />
    </div>
  );
}
