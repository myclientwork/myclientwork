import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobForm } from '@/features/jobs/components/job-form';

export const metadata = {
  title: 'Post Project Requirement',
  description: 'Submit your website or mobile app development project requirements.',
};

export default function PostRequirementPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm" className="gap-2 rounded-full border-border/80 shadow-sm hover:bg-accent">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 text-primary" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Post Project Requirement
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Fill out your project specifications, scope, budget, and timeline.
              Our engineering team will review your requirements and get in touch with a custom proposal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <JobForm />
        </div>
      </section>
    </>
  );
}
