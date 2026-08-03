import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobForm } from '@/features/jobs/components/job-form';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Post Project Requirement',
  description:
    'Submit your web or mobile app development project requirements to MyClientWork. Describe your needs and get matched with expert engineers.',
  path: '/post-a-job',
});

export default function PostRequirementPage() {
  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-background">
        <AuroraBackground className="border-b border-border/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Button asChild variant="outline" size="sm" className="gap-2 rounded-full border-border/80 shadow-sm hover:bg-accent backdrop-blur-xl">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 text-primary" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
            </div>
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1.5 mb-2">
                <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                AI Project Specification Engine
              </span>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-foreground">
                Post Project Requirement
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Specify your technical architecture, scope, budget, and timeline.
                Our engineering team will analyze your requirements and issue a formal execution roadmap within 24 hours.
              </p>
            </div>
          </div>
        </AuroraBackground>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <JobForm />
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
