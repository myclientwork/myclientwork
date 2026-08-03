import type { Metadata } from 'next';

// ─── Site-wide SEO Constants ───────────────────────────────────────────────────

export const SITE_URL = 'https://myclientwork.com';
export const SITE_NAME = 'MyClientWork';
export const SITE_TAGLINE = 'Digital Services. Professional Solutions.';
export const SITE_DESCRIPTION =
  'MyClientWork connects businesses with top-tier full-stack engineers and AI-powered workflows to deliver production-grade web applications, mobile apps, and cloud solutions.';

export const SITE_KEYWORDS = [
  'freelance developer',
  'hire full-stack developer',
  'web development services',
  'mobile app development',
  'AI-powered development',
  'Next.js development',
  'React developer',
  'custom software development',
  'cloud deployment',
  'API development',
  'security engineering',
  'DevOps services',
  'MyClientWork',
  'production-grade software',
  'hire software engineer',
];

export const OG_IMAGE = `${SITE_URL}/images/logo.svg`;

// ─── Default Metadata (applied via root layout) ───────────────────────────────

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  other: {
    'theme-color': '#0a0a0a',
    'msapplication-TileColor': '#0a0a0a',
  },
};

// ─── Page-level Metadata Helper ────────────────────────────────────────────────

export function createPageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// ─── Organization JSON-LD Structured Data ──────────────────────────────────────

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'myclientwork3@gmail.com',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

// ─── WebSite JSON-LD (for sitelinks search box) ───────────────────────────────

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
