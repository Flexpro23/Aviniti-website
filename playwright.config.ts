import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for Aviniti website.
 *
 * Tests run against a local Next.js dev server.
 * Set PLAYWRIGHT_BASE_URL to override (e.g. staging).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  /* Fail the build on CI if test.only is accidentally left in */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Single worker on CI to avoid port conflicts; parallel locally */
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    /* Default locale for tests */
    locale: 'en-US',
  },
  projects: [
    /* Run tests in Chromium only for speed */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Start the Next.js dev server; reuse if already running locally */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
    },
  },
});
