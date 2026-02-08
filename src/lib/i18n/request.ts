import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    },
    messages: {
      common: (await import(`../../../messages/${locale}/common.json`)).default,
      home: (await import(`../../../messages/${locale}/home.json`)).default,
      apps: (await import(`../../../messages/${locale}/apps.json`)).default,
      meta: (await import(`../../../messages/${locale}/meta.json`)).default,
      errors: (await import(`../../../messages/${locale}/errors.json`)).default,
      solutions: (await import(`../../../messages/${locale}/solutions.json`)).default,
      contact: (await import(`../../../messages/${locale}/contact.json`)).default,
      faq: (await import(`../../../messages/${locale}/faq.json`)).default,
      blog: (await import(`../../../messages/${locale}/blog.json`)).default,
      case_studies: (await import(`../../../messages/${locale}/case-studies.json`)).default,
      chatbot: (await import(`../../../messages/${locale}/chatbot.json`)).default,
      get_estimate: (await import(`../../../messages/${locale}/estimate.json`)).default,
      idea_lab: (await import(`../../../messages/${locale}/idea-lab.json`)).default,
      ai_analyzer: (await import(`../../../messages/${locale}/idea-analyzer.json`)).default,
      roi_calculator: (await import(`../../../messages/${locale}/roi-calculator.json`)).default,
      privacy_policy: (await import(`../../../messages/${locale}/privacy-policy.json`)).default,
      terms_of_service: (await import(`../../../messages/${locale}/terms-of-service.json`)).default,
    },
  };
});
