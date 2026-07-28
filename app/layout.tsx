import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteFooter } from '@/shared/components/layout/site-footer';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.myclientwork.online'),
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AuthProvider>
          <Toaster position="top-right" richColors duration={1500} />
        </ThemeProvider>
      </body>
    </html>
  );
}

