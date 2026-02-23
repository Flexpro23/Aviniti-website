/**
 * Image utilities
 *
 * Provides pre-generated blurDataURL placeholders for use with
 * Next.js Image `placeholder="blur"`. The placeholders match
 * the site's navy design system colour (#0A1628) so loading
 * states are invisible against the dark background.
 */

/**
 * Tiny 16:9 navy SVG encoded as a base64 data URI.
 * Use for hero images, solution cards, case study images.
 */
export const HERO_BLUR_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiA5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgZmlsbD0iIzBBMTYyOCIvPjwvc3ZnPg==';

/**
 * Tiny 1:1 navy SVG encoded as a base64 data URI.
 * Use for square thumbnails and blog card images.
 */
export const SQUARE_BLUR_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwQTE2MjgiLz48L3N2Zz4=';
