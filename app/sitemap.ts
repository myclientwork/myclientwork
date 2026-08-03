import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_URL } from '@/lib/seo';

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

    projectRoutes =
      projects?.map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })) ?? [];
  } catch {
    // Silently skip if DB is unreachable during build
  }

  // ─── Dynamic member routes ─────────────────────────────────────────────────
  let memberRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: members } = await supabase
      .from('members')
      .select('slug, updated_at');

    memberRoutes =
      members?.map((member) => ({
        url: `${SITE_URL}/members/${member.slug}`,
        lastModified: new Date(member.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })) ?? [];
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

    productRoutes =
      products?.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })) ?? [];
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

    jobRoutes =
      jobs?.map((job) => ({
        url: `${SITE_URL}/jobs/${job.slug}`,
        lastModified: new Date(job.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })) ?? [];
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
