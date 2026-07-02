// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { TOOLS, CATEGORIES } from '@/lib/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.SITE_URL || 'https://allsettools.com').replace(/\/$/, '');

  // Core indexable pages (excluding private admin console)
  const corePages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/tools', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/feedback', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/security', priority: 0.3, changeFrequency: 'yearly' as const }
  ].map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Programmatic Category SEO Pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/tools/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Tool specific pages
  const toolPages = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...corePages, ...categoryPages, ...toolPages];
}
