// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { TOOLS, CATEGORIES } from '@/lib/registry';
import { BLOG_POSTS } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://allsettools.dev';

  // Core pages
  const corePages = ['', '/blog', '/admin', '/feedback', '/about', '/contact', '/tools'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
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

  // Static blog pages
  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...corePages, ...categoryPages, ...toolPages, ...blogPages];
}
