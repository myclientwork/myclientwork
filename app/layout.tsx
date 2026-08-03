import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/shared/components/layout/site-header';
import { SiteFooter } from '@/shared/components/layout/site-footer';
import { AuthProvider } from '@/lib/auth-context';
import { SettingsProvider } from '@/shared/context/settings-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { DEFAULT_METADATA, getOrganizationJsonLd, getWebsiteJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebsiteJsonLd()),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster position="top-right" richColors duration={1500} />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
