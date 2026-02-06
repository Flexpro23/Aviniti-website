// Static data for the 4 core services

export interface Service {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  features: string[];
}

export const services: Service[] = [
  {
    slug: 'mobile-apps',
    nameKey: 'services.mobile-apps.name',
    descriptionKey: 'services.mobile-apps.description',
    icon: 'Smartphone',
    features: [
      'services.mobile-apps.features.0',
      'services.mobile-apps.features.1',
      'services.mobile-apps.features.2',
      'services.mobile-apps.features.3',
    ],
  },
  {
    slug: 'web-applications',
    nameKey: 'services.web-applications.name',
    descriptionKey: 'services.web-applications.description',
    icon: 'Globe',
    features: [
      'services.web-applications.features.0',
      'services.web-applications.features.1',
      'services.web-applications.features.2',
      'services.web-applications.features.3',
    ],
  },
  {
    slug: 'ai-solutions',
    nameKey: 'services.ai-solutions.name',
    descriptionKey: 'services.ai-solutions.description',
    icon: 'Brain',
    features: [
      'services.ai-solutions.features.0',
      'services.ai-solutions.features.1',
      'services.ai-solutions.features.2',
      'services.ai-solutions.features.3',
    ],
  },
  {
    slug: 'ui-ux-design',
    nameKey: 'services.ui-ux-design.name',
    descriptionKey: 'services.ui-ux-design.description',
    icon: 'Palette',
    features: [
      'services.ui-ux-design.features.0',
      'services.ui-ux-design.features.1',
      'services.ui-ux-design.features.2',
      'services.ui-ux-design.features.3',
    ],
  },
];
