import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_URL } from '@/lib/seo';

/**
 * Ensures a slug is clean, lowercased, hyphenated, and contains no spaces or invalid characters.
 * E.g., "Support Engineer" -> "support-engineer"
 */
function toCleanSlug(rawSlug: unknown): string | null {
  if (!rawSlug || typeof rawSlug !== 'string') return null;
  const trimmed = rawSlug.trim();
  if (!trimmed) return null;
  const slugified = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
  return slugified || null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Static public routes ──────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/members`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/post-a-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ─── Dynamic project routes ────────────────────────────────────────────────
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'PUBLISHED');

    projectRoutes = (projects ?? [])
      .map((project) => {
        const slug = toCleanSlug(project.slug);
        if (!slug) return null;
        return {
          url: `${SITE_URL}/projects/${slug}`,
          lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch {
    // Silently skip if DB is unreachable during build
  }

  // ─── Dynamic member routes ─────────────────────────────────────────────────
  let memberRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: members } = await supabase
      .from('members')
      .select('slug, updated_at');

    memberRoutes = (members ?? [])
      .map((member) => {
        const slug = toCleanSlug(member.slug);
        if (!slug) return null;
        return {
          url: `${SITE_URL}/members/${slug}`,
          lastModified: member.updated_at ? new Date(member.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch {
    // Silently skip
  }

  // ─── Dynamic product routes ────────────────────────────────────────────────
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'PUBLISHED');

    productRoutes = (products ?? [])
      .map((product) => {
        const slug = toCleanSlug(product.slug);
        if (!slug) return null;
        return {
          url: `${SITE_URL}/products/${slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch {
    // Silently skip
  }

  // ─── Dynamic job routes ────────────────────────────────────────────────────
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: jobs } = await supabase
      .from('job_postings')
      .select('slug, updated_at')
      .eq('status', 'PUBLISHED');

    jobRoutes = (jobs ?? [])
      .map((job) => {
        const slug = toCleanSlug(job.slug);
        if (!slug) return null;
        return {
          url: `${SITE_URL}/jobs/${slug}`,
          lastModified: job.updated_at ? new Date(job.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch {
    // Silently skip
  }

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...memberRoutes,
    ...productRoutes,
    ...jobRoutes,
  ];
}
