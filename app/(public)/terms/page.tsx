import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms & Conditions',
  description:
    'Read the terms and conditions governing your use of the MyClientWork platform, including project submissions, payments, and service agreements.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>
      <div className="prose prose-sm mt-8 max-w-none text-muted-foreground">
        <p>
          By using this website and submitting job requests or contact
          messages, you agree to the following terms.
        </p>
        <h2 className="text-foreground">Use of the Platform</h2>
        <p>
          This platform is a group portfolio and client job-request service.
          You may browse public projects and submit project requirements. You
          agree to provide accurate information.
        </p>
        <h2 className="text-foreground">Job Requests</h2>
        <p>
          Submitting a job request does not constitute a binding contract. We
          review each request and respond based on availability and fit. Any
          future engagement will be governed by a separate agreement.
        </p>
        <h2 className="text-foreground">Intellectual Property</h2>
        <p>
          All project case studies, content, and code shown on this platform
          are the property of MyClientWork or our clients. You may not
          reproduce or distribute our work without permission.
        </p>
        <h2 className="text-foreground">Liability</h2>
        <p>
          We make no guarantees regarding project availability, timelines, or
          outcomes until a separate agreement is signed. This platform is
          provided as-is.
        </p>
        <h2 className="text-foreground">Contact</h2>
        <p>
          For questions about these terms, email us at
          myclientwork3@gmail.com or call +977-981621091.
        </p>
      </div>
    </div>
  );
}
