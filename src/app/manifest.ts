/**
 * Web App Manifest — PWA support
 *
 * Enables "Add to Home Screen" on mobile devices, splash screens,
 * and improves discoverability in app stores / browser UIs.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aviniti — App Development & AI Solutions',
    short_name: 'Aviniti',
    description:
      'Custom mobile apps, web applications, and AI-powered business solutions from Amman, Jordan. Your Ideas, Our Reality.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0A1628',
    theme_color: '#0A1628',
    orientation: 'portrait-primary',
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Get a Free Estimate',
        short_name: 'Estimate',
        description: 'Get an AI-powered cost estimate for your app idea',
        url: '/en/get-estimate',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Idea Lab',
        short_name: 'Idea Lab',
        description: 'Validate your business idea with AI',
        url: '/en/idea-lab',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Ready-Made Solutions',
        short_name: 'Solutions',
        description: 'Browse pre-built software systems',
        url: '/en/solutions',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
    screenshots: [],
    prefer_related_applications: false,
  };
}
