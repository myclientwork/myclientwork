import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://myclientwork.com'),
  title: {
    default: 'MyClientWork — Digital Services. Professional Solutions. Growth.',
    template: '%s | MyClientWork',
  },
  description:
    'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.',
  openGraph: {
    title: 'MyClientWork — Digital Services. Professional Solutions. Growth.',
    description:
      'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
