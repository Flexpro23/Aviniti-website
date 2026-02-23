import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/test-pdf/',
          '/*/idea-lab',
          '/*/ai-analyzer',
          '/*/get-estimate',
          '/*/roi-calculator',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
