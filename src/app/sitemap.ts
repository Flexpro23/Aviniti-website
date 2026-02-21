import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.aviniti.app';

// Static pages
const staticPages = [
  '',
  '/contact',
  '/solutions',
  '/blog',
  '/case-studies',
  '/faq',
  '/privacy-policy',
  '/terms-of-service',
  '/ai-analyzer',
  '/get-estimate',
  '/idea-lab',
  '/roi-calculator',
  '/about',
];

// Dynamic slugs
const solutionSlugs = [
  'delivery-app-system',
  'kindergarten-management',
  'hypermarket-management',
  'office-management',
  'gym-management',
  'airbnb-marketplace',
  'hair-transplant-ai',
];

const blogSlugs = [
  'ai-transforming-mobile-app-development',
  'choosing-right-tech-stack-startup',
  'building-scalable-delivery-apps',
  'web-app-performance-optimization',
  'future-of-ai-powered-business-tools',
];

const caseStudySlugs = [
  'logistics-delivery-optimization',
  'ecommerce-retail-automation',
  'education-kindergarten-system',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'ar'];
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            ar: `${BASE_URL}/ar${page}`,
          },
        },
      });
    }
  }

  // Solution detail pages
  for (const slug of solutionSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/solutions/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/solutions/${slug}`,
            ar: `${BASE_URL}/ar/solutions/${slug}`,
          },
        },
      });
    }
  }

  // Blog posts
  for (const slug of blogSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/blog/${slug}`,
            ar: `${BASE_URL}/ar/blog/${slug}`,
          },
        },
      });
    }
  }

  // Case studies
  for (const slug of caseStudySlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/case-studies/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/case-studies/${slug}`,
            ar: `${BASE_URL}/ar/case-studies/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
