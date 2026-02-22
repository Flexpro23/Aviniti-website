// Navigation link configuration for desktop and mobile menus

export interface NavLink {
  labelKey: string;
  href: string;
  icon?: string;
  isHighlighted?: boolean;
}

export interface NavSection {
  titleKey: string;
  links: NavLink[];
}

// Main navigation links (desktop navbar)
export const mainNavLinks: NavLink[] = [
  {
    labelKey: 'nav.home',
    href: '/',
  },
  {
    labelKey: 'nav.solutions',
    href: '/solutions',
  },
  {
    labelKey: 'nav.caseStudies',
    href: '/case-studies',
  },
  {
    labelKey: 'nav.blog',
    href: '/blog',
  },
  {
    labelKey: 'nav.faq',
    href: '/faq',
  },
  {
    labelKey: 'nav.contact',
    href: '/contact',
  },
];

// AI Tools links (special section in mobile, or dropdown in desktop)
export const aiToolsLinks: NavLink[] = [
  {
    labelKey: 'nav.aiTools.ideaLab',
    href: '/idea-lab',
    icon: 'Lightbulb',
    isHighlighted: true,
  },
  {
    labelKey: 'nav.aiTools.analyzer',
    href: '/ai-analyzer',
    icon: 'Search',
  },
  {
    labelKey: 'nav.aiTools.estimate',
    href: '/get-estimate',
    icon: 'Calculator',
  },
  {
    labelKey: 'nav.aiTools.roiCalculator',
    href: '/roi-calculator',
    icon: 'TrendingUp',
  },
];

// Footer navigation sections
export const footerSections: NavSection[] = [
  {
    titleKey: 'footer.quickLinks',
    links: [
      { labelKey: 'footer.aboutUs', href: '/about' },
      { labelKey: 'footer.solutions', href: '/solutions' },
      { labelKey: 'footer.caseStudies', href: '/case-studies' },
      { labelKey: 'footer.blog', href: '/blog' },
      { labelKey: 'footer.contact', href: '/contact' },
    ],
  },
  {
    titleKey: 'footer.aiTools',
    links: [
      { labelKey: 'footer.ideaLab', href: '/idea-lab' },
      { labelKey: 'footer.analyzer', href: '/ai-analyzer' },
      { labelKey: 'footer.estimate', href: '/get-estimate' },
      { labelKey: 'footer.roiCalculator', href: '/roi-calculator' },
    ],
  },
  {
    titleKey: 'footer.resources',
    links: [
      { labelKey: 'footer.faq', href: '/faq' },
      { labelKey: 'footer.privacyPolicy', href: '/privacy-policy' },
      { labelKey: 'footer.termsOfService', href: '/terms-of-service' },
    ],
  },
];

// Legal links (footer bottom)
export const legalLinks: NavLink[] = [
  {
    labelKey: 'footer.privacyPolicy',
    href: '/privacy-policy',
  },
  {
    labelKey: 'footer.termsOfService',
    href: '/terms-of-service',
  },
];

// Social media links
export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/company/avinitiapp/',
    icon: 'Linkedin',
  },
  {
    platform: 'Facebook',
    href: 'https://www.facebook.com/people/Aviniti/61558788565903/',
    icon: 'Facebook',
  },
  {
    platform: 'Instagram',
    href: 'https://www.instagram.com/aviniti_1/',
    icon: 'Instagram',
  },
];
