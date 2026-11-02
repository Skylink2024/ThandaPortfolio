import type { MetadataRoute } from 'next';
import { site } from '@data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/work', '/build', '/about', '/contact', '/faq'];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
