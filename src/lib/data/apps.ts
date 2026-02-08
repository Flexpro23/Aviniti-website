// Static data for live apps in stores

export interface LiveApp {
  name: string;
  descriptionKey: string;
  icon: string;
  categoryKey: string;
  appStore?: string;
  googlePlay?: string;
}

export const liveApps: LiveApp[] = [
  {
    name: 'SkinVerse',
    descriptionKey: 'skinverse.description',
    icon: '/images/apps/skinverse-icon.png',
    categoryKey: 'categories.health_beauty',
    appStore: 'https://apps.apple.com/app/skinverse',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.skinverse',
  },
  {
    name: 'Caliber OS',
    descriptionKey: 'caliberos.description',
    icon: '/images/apps/caliberos-icon.png',
    categoryKey: 'categories.beauty_style',
    appStore: 'https://apps.apple.com/app/caliberos',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.caliberos',
  },
  {
    name: 'QuickDeliver',
    descriptionKey: 'quickdeliver.description',
    icon: '/images/apps/quickdeliver-icon.png',
    categoryKey: 'categories.business',
    appStore: 'https://apps.apple.com/app/quickdeliver',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.quickdeliver',
  },
  {
    name: 'EduTrack',
    descriptionKey: 'edutrack.description',
    icon: '/images/apps/edutrack-icon.png',
    categoryKey: 'categories.education',
    appStore: 'https://apps.apple.com/app/edutrack',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.edutrack',
  },
  {
    name: 'ShopSmart',
    descriptionKey: 'shopsmart.description',
    icon: '/images/apps/shopsmart-icon.png',
    categoryKey: 'categories.shopping',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.shopsmart',
  },
  {
    name: 'FitHub Pro',
    descriptionKey: 'fithubpro.description',
    icon: '/images/apps/fithubpro-icon.png',
    categoryKey: 'categories.health_fitness',
    appStore: 'https://apps.apple.com/app/fithubpro',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.fithubpro',
  },
  {
    name: 'StayBook',
    descriptionKey: 'staybook.description',
    icon: '/images/apps/staybook-icon.png',
    categoryKey: 'categories.travel',
    appStore: 'https://apps.apple.com/app/staybook',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.staybook',
  },
  {
    name: 'RestoPOS',
    descriptionKey: 'restopos.description',
    icon: '/images/apps/restopos-icon.png',
    categoryKey: 'categories.business',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.restopos',
  },
];
