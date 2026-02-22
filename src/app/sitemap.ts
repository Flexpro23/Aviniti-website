import type { MetadataRoute } from 'next';
import { SITE_URL as BASE_URL } from '@/lib/config';
import { getAllBlogSlugs } from '@/lib/firebase/blog';

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

// Solution slugs — update when new solutions are added
const solutionSlugs = [
  'delivery-app-system',
  'kindergarten-management',
  'hypermarket-management',
  'office-management',
  'gym-management',
  'airbnb-marketplace',
  'hair-transplant-ai',
  'barbershop-management',
];

// Case study slugs — update when new case studies are added
const caseStudySlugs = [
  'logistics-delivery-optimization',
  'ecommerce-retail-automation',
  'education-kindergarten-system',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'ar'];
  const entries: MetadataRoute.Sitemap = [];

  // Fetch live blog slugs from Firestore; fall back to empty array if unavailable
  let blogSlugs: string[] = [];
  try {
    blogSlugs = await getAllBlogSlugs();
  } catch (err) {
    console.warn('[sitemap] Could not fetch blog slugs from Firestore:', err);
  }

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

  // Blog posts — dynamically fetched from Firestore
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
