import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.myclientwork.online';

  const routes = [
    '',
    '/services',
    '/projects',
    '/about',
    '/contact',
    '/members',
    '/jobs',
    '/products',
    '/post-a-job',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
