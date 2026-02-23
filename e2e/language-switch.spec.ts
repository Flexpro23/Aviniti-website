import { test, expect } from '@playwright/test';

/**
 * Language Switching — EN ↔ AR
 *
 * The LanguageSwitcher is a globe-icon button in the navbar that shows the
 * current locale (e.g. "EN"). Clicking it opens a dropdown with locale options
 * rendered as [role="menuitem"] buttons.  Selecting a locale replaces the URL
 * prefix (/en/ → /ar/) and sets html[lang] / html[dir] accordingly.
 */

/** Click the locale switcher trigger in the navbar and pick the target locale */
async function switchLocale(
  page: import('@playwright/test').Page,
  targetLocale: 'AR' | 'EN',
) {
  // The language switcher trigger has aria-label="Switch language" in the header.
  // We use aria-label (not aria-haspopup) because the AI Tools nav button
  // also has aria-haspopup and would be matched first by a generic selector.
  // aria-label is "Switch language" in EN, "تغيير اللغة" in AR — match both
  const trigger = page.locator('header').getByRole('button', { name: /switch language|تغيير اللغة/i });
  await expect(trigger).toBeVisible();
  await trigger.click();

  // After opening, click the desired locale menu item.
  // Menu items render the translated name: "English" for en, "العربية" for ar.
  const textPattern = targetLocale === 'AR' ? /عربية/i : /english/i;
  const option = page.locator('[role="menuitem"]').filter({ hasText: textPattern }).first();
  await expect(option).toBeVisible({ timeout: 3000 });
  await option.click();
}

test.describe('Language Switching (EN ↔ AR)', () => {
  // Use a longer timeout for this suite — language switching involves a full page navigation
  // which can be slow on a dev server with multiple parallel test workers.
  test.setTimeout(60000);

  test('English is default locale', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('load');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('language switcher trigger is visible in navbar', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('load');
    // Language switcher trigger has aria-label="Switch language"
    // aria-label is "Switch language" in EN, "تغيير اللغة" in AR — match both
    const trigger = page.locator('header').getByRole('button', { name: /switch language|تغيير اللغة/i });
    await expect(trigger).toBeVisible();
  });

  test('switching to Arabic changes URL to /ar/', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('load');
    await switchLocale(page, 'AR');
    // next-intl may redirect to /ar (no trailing slash) or /ar/ — accept both
    await page.waitForURL(/\/ar/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/ar/);
  });

  test('Arabic page has dir=rtl on html', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('load');
    await switchLocale(page, 'AR');
    await page.waitForURL(/\/ar/, { timeout: 15000 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('Arabic page has lang=ar on html', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('load');
    await switchLocale(page, 'AR');
    await page.waitForURL(/\/ar/, { timeout: 15000 });
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('switching back to English changes URL to /en/', async ({ page }) => {
    await page.goto('/ar/');
    await page.waitForLoadState('load');
    await switchLocale(page, 'EN');
    // next-intl may redirect to /en (no trailing slash) or /en/ — accept both
    await page.waitForURL(/\/en/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/en/);
  });

  test('English page restores dir=ltr', async ({ page }) => {
    await page.goto('/ar/');
    await page.waitForLoadState('load');
    await switchLocale(page, 'EN');
    await page.waitForURL(/\/en/, { timeout: 15000 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});
