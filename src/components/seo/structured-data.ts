// Structured data generators for JSON-LD
// These follow schema.org specifications

import { SITE_URL, LOGO_URL } from '@/lib/config';

/**
 * Organization schema
 * @see https://schema.org/Organization
 */
export function getOrganizationSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Aviniti',
    alternateName: locale === 'ar' ? 'أفينيتي' : undefined,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    description: locale === 'ar'
      ? 'شركة تطوير تطبيقات وحلول ذكاء اصطناعي مقرها الأردن. نحول أفكارك إلى واقع رقمي.'
      : 'Jordan-based app development and AI solutions company. We turn your ideas into digital reality.',
    slogan: locale === 'ar' ? 'أفكارك، واقعنا' : 'Your Ideas, Our Reality',
    foundingDate: '2024',
    areaServed: [
      { '@type': 'Country', name: 'Jordan' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
      url: `${SITE_URL}/${locale}/contact`,
    },
    sameAs: [
      // Add social media URLs when available
    ],
  };
}

/**
 * WebSite schema with search action
 * @see https://schema.org/WebSite
 */
export function getWebSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: 'Aviniti',
    description: locale === 'ar'
      ? 'حلول تطوير التطبيقات والذكاء الاصطناعي'
      : 'App Development & AI Solutions',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: locale === 'ar' ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/solutions?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Service schema for AI tools and app development
 * @see https://schema.org/Service
 */
export function getServicesSchema(locale: string) {
  const services = [
    {
      '@type': 'Service',
      name: locale === 'ar' ? 'تطوير تطبيقات الجوال' : 'Mobile App Development',
      description: locale === 'ar'
        ? 'تصميم وتطوير تطبيقات iOS و Android مخصصة بأحدث التقنيات'
        : 'Custom iOS and Android app design and development with cutting-edge technology',
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'Mobile App Development',
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: { '@type': 'GeoCoordinates', latitude: 31.9454, longitude: 35.9284 },
        geoRadius: '5000',
      },
    },
    {
      '@type': 'Service',
      name: locale === 'ar' ? 'تطوير تطبيقات الويب' : 'Web App Development',
      description: locale === 'ar'
        ? 'بناء تطبيقات ويب سريعة وآمنة وقابلة للتوسع'
        : 'Building fast, secure, and scalable web applications',
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'Web Development',
    },
    {
      '@type': 'Service',
      name: locale === 'ar' ? 'حلول الذكاء الاصطناعي' : 'AI Solutions',
      description: locale === 'ar'
        ? 'دمج تقنيات الذكاء الاصطناعي في أعمالك لتحسين الكفاءة والإنتاجية'
        : 'Integrating AI technologies into your business to improve efficiency and productivity',
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'AI Integration',
    },
    {
      '@type': 'Service',
      name: locale === 'ar' ? 'أتمتة العمليات' : 'Process Automation',
      description: locale === 'ar'
        ? 'أتمتة العمليات التجارية لتوفير الوقت وتقليل التكاليف'
        : 'Automating business processes to save time and reduce costs',
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'Business Process Automation',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': services,
  };
}

/**
 * LocalBusiness schema — enhances local search visibility
 * Combines with Organization for richer entity understanding
 * @see https://schema.org/LocalBusiness
 */
export function getLocalBusinessSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Aviniti',
    alternateName: locale === 'ar' ? 'أفينيتي' : undefined,
    description: locale === 'ar'
      ? 'شركة تطوير تطبيقات وحلول ذكاء اصطناعي مقرها عمّان، الأردن. نحول أفكارك إلى واقع رقمي.'
      : 'Jordan-based app development and AI solutions company in Amman. We turn your ideas into digital reality.',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: LOGO_URL,
    email: 'aliodat@aviniti.app',
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'ar' ? 'عمّان' : 'Amman',
      addressRegion: locale === 'ar' ? 'محافظة عمّان' : 'Amman Governorate',
      addressCountry: 'JO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.9454,
      longitude: 35.9284,
    },
    hasMap: 'https://maps.google.com/?q=Amman,Jordan',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$$',
    currenciesAccepted: 'USD, JOD',
    paymentAccepted: 'Bank Transfer, Credit Card',
    areaServed: [
      { '@type': 'Country', name: locale === 'ar' ? 'الأردن' : 'Jordan' },
      { '@type': 'Country', name: locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia' },
      { '@type': 'Country', name: locale === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates' },
    ],
    knowsAbout: [
      'Mobile App Development',
      'Web Application Development',
      'Artificial Intelligence',
      'Business Process Automation',
      'React Native',
      'Next.js',
      'Firebase',
    ],
    foundingDate: '2024',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 20,
    },
    sameAs: [],
    parentOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

/**
 * BlogPosting schema for individual blog post pages
 * @see https://schema.org/BlogPosting
 */
export function getBlogPostingSchema({
  locale,
  slug,
  title,
  description,
  publishedAt,
  featuredImage,
  tags,
  readingTime,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  featuredImage?: string;
  tags?: string[];
  readingTime?: number;
}) {
  const postUrl = `${SITE_URL}/${locale}/blog/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: title,
    description,
    url: postUrl,
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: locale === 'ar' ? 'ar' : 'en-US',
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Aviniti',
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${SITE_URL}/${locale}/blog`,
      name: locale === 'ar' ? 'مدونة أفينيتي' : 'Aviniti Blog',
      url: `${SITE_URL}/${locale}/blog`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: featuredImage,
        width: 1200,
        height: 630,
      },
    }),
    ...(tags?.length && {
      keywords: tags.join(', '),
    }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
    about: {
      '@type': 'Thing',
      name: locale === 'ar' ? 'تطوير التطبيقات والذكاء الاصطناعي' : 'App Development & AI',
    },
  };
}

/**
 * Combined schema graph for the homepage
 * Merges Organization + WebSite + Services into a single @graph
 */
export function getHomepageSchema(locale: string) {
  const org = getOrganizationSchema(locale);
  const website = getWebSiteSchema(locale);
  const services = getServicesSchema(locale);

  // Remove individual @context to combine into graph
  const { '@context': _c1, ...orgData } = org;
  const { '@context': _c2, ...websiteData } = website;
  const { '@context': _c3, '@graph': serviceItems } = services;

  return {
    '@context': 'https://schema.org',
    '@graph': [orgData, websiteData, ...serviceItems],
  };
}
