import { AdminGuard } from '@/components/site/admin-guard';
import { JobPostingForm } from '@/components/site/job-posting-form';

export const metadata = {
  title: 'Post a Job',
  description: 'Create a new job posting (admin only).',
};

export default function PostAJobPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Post a Job
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Create a new job posting. Published jobs will be visible to all
              visitors, and logged-in users can apply.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdminGuard>
            <div className="mx-auto max-w-3xl">
              <JobPostingForm />
            </div>
          </AdminGuard>
        </div>
      </section>
    </>
  );
}
