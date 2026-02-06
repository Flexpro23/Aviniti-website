// Static data for live apps in stores

export interface LiveApp {
  name: string;
  descriptionKey: string;
  icon: string;
  category: string;
  appStore?: string;
  googlePlay?: string;
}

export const liveApps: LiveApp[] = [
  {
    name: 'SkinVerse',
    descriptionKey: 'apps.skinverse.description',
    icon: '/images/apps/skinverse-icon.png',
    category: 'Health & Beauty',
    appStore: 'https://apps.apple.com/app/skinverse',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.skinverse',
  },
  {
    name: 'Caliber OS',
    descriptionKey: 'apps.caliberos.description',
    icon: '/images/apps/caliberos-icon.png',
    category: 'Beauty & Style',
    appStore: 'https://apps.apple.com/app/caliberos',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.caliberos',
  },
  {
    name: 'QuickDeliver',
    descriptionKey: 'apps.quickdeliver.description',
    icon: '/images/apps/quickdeliver-icon.png',
    category: 'Business',
    appStore: 'https://apps.apple.com/app/quickdeliver',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.quickdeliver',
  },
  {
    name: 'EduTrack',
    descriptionKey: 'apps.edutrack.description',
    icon: '/images/apps/edutrack-icon.png',
    category: 'Education',
    appStore: 'https://apps.apple.com/app/edutrack',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.edutrack',
  },
  {
    name: 'ShopSmart',
    descriptionKey: 'apps.shopsmart.description',
    icon: '/images/apps/shopsmart-icon.png',
    category: 'Shopping',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.shopsmart',
  },
  {
    name: 'FitHub Pro',
    descriptionKey: 'apps.fithubpro.description',
    icon: '/images/apps/fithubpro-icon.png',
    category: 'Health & Fitness',
    appStore: 'https://apps.apple.com/app/fithubpro',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.fithubpro',
  },
  {
    name: 'StayBook',
    descriptionKey: 'apps.staybook.description',
    icon: '/images/apps/staybook-icon.png',
    category: 'Travel',
    appStore: 'https://apps.apple.com/app/staybook',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.staybook',
  },
  {
    name: 'RestoPOS',
    descriptionKey: 'apps.restopos.description',
    icon: '/images/apps/restopos-icon.png',
    category: 'Business',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.aviniti.restopos',
  },
];
