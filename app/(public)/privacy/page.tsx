import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how MyClientWork collects, uses, and protects your personal data. Read our full privacy policy for transparency on data handling practices.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>
      <div className="prose prose-sm mt-8 max-w-none text-muted-foreground">
        <p>
          This privacy policy describes how MyClientWork collects, uses, and
          protects information submitted through this website.
        </p>
        <h2 className="text-foreground">Information We Collect</h2>
        <p>
          We collect information you provide directly, including your name,
          email, phone number, company, and project requirements when you
          submit a contact message or job request.
        </p>
        <h2 className="text-foreground">How We Use Your Information</h2>
        <p>
          We use your information to respond to your inquiries, review job
          requests, and communicate with you about potential projects. We do
          not sell or share your data with third parties.
        </p>
        <h2 className="text-foreground">Data Storage</h2>
        <p>
          Your data is stored securely in a Supabase PostgreSQL database with
          row-level security enabled. Job attachments are stored in private
          storage with authorized access only.
        </p>
        <h2 className="text-foreground">Your Rights</h2>
        <p>
          You may request export or deletion of your data at any time by
          contacting us at myclientwork3@gmail.com.
        </p>
        <h2 className="text-foreground">Contact</h2>
        <p>
          For privacy-related questions, email us at myclientwork3@gmail.com or
          call +977-981621091.
        </p>
      </div>
    </div>
  );
}
