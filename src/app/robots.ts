import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/test-pdf/'],
      },
    ],
    sitemap: 'https://www.aviniti.app/sitemap.xml',
  };
}
