import { test, expect } from '@playwright/test';

test.describe('Navigation & Homepage', () => {
  test('homepage loads with visible heading', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('navbar is visible on homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();
  });

  test('logo link is present', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    // Logo link: aria-label contains "home" (case-insensitive) OR href points to root/en
    const logoLink = page
      .locator('a[aria-label*="home" i], a[href="/"], a[href="/en"], a[href="/en/"]')
      .first();
    await expect(logoLink).toBeVisible();
  });

  test('contact CTA in navbar links to /en/contact', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    // Find the "Get in Touch" button or link in the header/navbar area
    const header = page.locator('header, [role="banner"]').first();
    const ctaLink = header.locator('a, button').filter({ hasText: /touch/i }).first();
    await expect(ctaLink).toBeVisible();
    // If it's an anchor, verify the href
    const tagName = await ctaLink.evaluate((el) => el.tagName.toLowerCase());
    if (tagName === 'a') {
      const href = await ctaLink.getAttribute('href');
      expect(href).toContain('/contact');
    }
  });

  test('all main pages return 200 (no broken links)', async ({ page }) => {
    const pages = [
      '/en/about',
      '/en/contact',
      '/en/solutions',
      '/en/blog',
      '/en/faq',
    ];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Verify no 404 text on the page
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/\b404\b/i);

      // Verify page title does not contain 404
      const title = await page.title();
      expect(title).not.toContain('404');
    }
  });

  test('AI tools pages are accessible', async ({ page }) => {
    const aiToolPaths = [
      '/en/idea-lab',
      '/en/ai-analyzer',
      '/en/get-estimate',
      '/en/roi-calculator',
    ];

    for (const path of aiToolPaths) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Each AI tool page should have a visible h1
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
    }
  });

  test('footer is visible on homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();
  });
});
