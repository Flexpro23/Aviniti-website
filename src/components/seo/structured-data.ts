// Structured data generators for JSON-LD
// These follow schema.org specifications

const SITE_URL = 'https://www.aviniti.app';
const LOGO_URL = `${SITE_URL}/images/logo.png`;

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
