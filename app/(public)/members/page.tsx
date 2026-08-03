import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { MembersClient } from '@/components/members/members-client';
import { createPageMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: 'Our Team',
  description:
    'Meet the engineers and designers at MyClientWork — specialists in full-stack web development, cybersecurity, cloud infrastructure, and AI-driven solutions.',
  path: '/members',
});

async function getMembers() {
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('display_order', { ascending: true });
  return (data as Member[]) ?? [];
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Vetted Expert Engineers
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl text-foreground">
              Meet the Engineering Team
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Top-tier full-stack developers with proven production track records building mission-critical applications used by thousands.
            </p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MembersClient members={members} />
        </div>
      </section>
    </div>
  );
}
