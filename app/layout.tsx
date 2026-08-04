import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { SettingsProvider } from '@/shared/context/settings-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { DEFAULT_METADATA, getOrganizationJsonLd, getWebsiteJsonLd } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#050816' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch & preconnect for faster Supabase API calls */}
        {supabaseHost && (
          <>
            <link rel="dns-prefetch" href={`https://${supabaseHost}`} />
            <link rel="preconnect" href={`https://${supabaseHost}`} crossOrigin="anonymous" />
          </>
        )}
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
