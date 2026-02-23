import { test, expect } from '@playwright/test';

test.describe('Language Switching (EN ↔ AR)', () => {
  test('English is default locale', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('language switcher is visible in navbar', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    // In EN mode, the switcher should show "AR" or "عربي"
    const switcher = page
      .locator('button, a')
      .filter({ hasText: /^(AR|عربي)$/i })
      .first();
    await expect(switcher).toBeVisible();
  });

  test('switching to Arabic changes URL to /ar/', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const arSwitcher = page
      .locator('button, a')
      .filter({ hasText: /^(AR|عربي)$/i })
      .first();
    await arSwitcher.click();

    await page.waitForURL(/\/ar\//);
    expect(page.url()).toContain('/ar/');
  });

  test('Arabic page has dir=rtl on html', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const arSwitcher = page
      .locator('button, a')
      .filter({ hasText: /^(AR|عربي)$/i })
      .first();
    await arSwitcher.click();
    await page.waitForURL(/\/ar\//);

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('Arabic page has lang=ar on html', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const arSwitcher = page
      .locator('button, a')
      .filter({ hasText: /^(AR|عربي)$/i })
      .first();
    await arSwitcher.click();
    await page.waitForURL(/\/ar\//);

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('switching back to English changes URL to /en/', async ({ page }) => {
    await page.goto('/ar/');
    await page.waitForLoadState('networkidle');

    // In AR mode, the switcher should show "EN" or "English"
    const enSwitcher = page
      .locator('button, a')
      .filter({ hasText: /^(EN|English)$/i })
      .first();
    await enSwitcher.click();

    await page.waitForURL(/\/en\//);
    expect(page.url()).toContain('/en/');
  });

  test('English page restores dir=ltr', async ({ page }) => {
    await page.goto('/ar/');
    await page.waitForLoadState('networkidle');

    const enSwitcher = page
      .locator('button, a')
      .filter({ hasText: /^(EN|English)$/i })
      .first();
    await enSwitcher.click();
    await page.waitForURL(/\/en\//);

    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});
