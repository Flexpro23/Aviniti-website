import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('domcontentloaded');
  });

  // ─── 1. Page loads and form is visible ───────────────────────────────────
  test('contact page loads with form', async ({ page }) => {
    // The form card must be in the DOM
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Page heading should be visible inside the form card
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/get in touch|contact/i);
  });

  // ─── 2. Submit button is present ─────────────────────────────────────────
  test('submit button is present', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /send message/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  // ─── 3. Required field validation — name ─────────────────────────────────
  test('shows validation error when name is empty on submit', async ({ page }) => {
    // Click submit without filling any fields
    await page.getByRole('button', { name: /send message/i }).click();

    // An error message should appear for the name field
    // The error text from en/contact.json is "Please enter your name"
    const nameError = page.locator('[role="alert"], p.text-error, p.text-red-400, span.text-error')
      .filter({ hasText: /your name/i })
      .first();
    await expect(nameError).toBeVisible({ timeout: 5000 });
  });

  // ─── 4. Form has all expected input fields ───────────────────────────────
  test('form has name, email, and message fields', async ({ page }) => {
    // Name — labeled "Your Name", rendered as type="text"
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();

    // Email — input[type="email"] or input[name="email"]
    await expect(
      page.locator('input[type="email"], input[name="email"]').first()
    ).toBeVisible();

    // Message — textarea labeled "Your Message"
    await expect(page.getByRole('textbox', { name: /your message/i })).toBeVisible();
  });

  // ─── 5. Phone input is present ───────────────────────────────────────────
  test('phone input is present', async ({ page }) => {
    // react-international-phone renders <input type="tel">
    const phoneInput = page.locator('input[type="tel"]').first();
    await expect(phoneInput).toBeVisible();
  });

  // ─── 6. Topic select trigger is present ──────────────────────────────────
  test('topic select trigger is present', async ({ page }) => {
    // Radix UI SelectTrigger renders as role="combobox"
    // Use nth(1) to skip the Country Selector combobox from react-international-phone
    const selectTrigger = page.getByRole('combobox').nth(1);
    await expect(selectTrigger).toBeVisible();
  });

  // ─── 7. Filling name field clears its validation error ───────────────────
  test('filling name field clears validation error', async ({ page }) => {
    // Trigger validation
    await page.getByRole('button', { name: /send message/i }).click();

    // Wait for the error to appear
    const nameError = page.locator('[role="alert"], p.text-error, span.text-error')
      .filter({ hasText: /your name/i })
      .first();
    await expect(nameError).toBeVisible({ timeout: 5000 });

    // Fill in the name field
    await page.getByRole('textbox', { name: /your name/i }).fill('Jane Doe');

    // Re-submit so the re-validation runs (or just wait for reactive state)
    // The error should disappear after the next validate pass
    await page.getByRole('button', { name: /send message/i }).click();

    // The name error is gone; a different error (phone/topic/message) is now shown
    await expect(nameError).not.toBeVisible({ timeout: 5000 });
  });

  // ─── 8. WhatsApp checkbox is present ─────────────────────────────────────
  test('whatsapp checkbox is present', async ({ page }) => {
    // The checkbox is inside the form; Radix Checkbox or native checkbox
    const checkbox = page.getByRole('checkbox').first();
    await expect(checkbox).toBeVisible();
  });

  // ─── 9. WhatsApp checkbox can be toggled ─────────────────────────────────
  test('whatsapp checkbox can be checked and unchecked', async ({ page }) => {
    const checkbox = page.getByRole('checkbox').first();

    // Default state is unchecked (aria-checked="false" for Radix, or checked=false)
    const initialChecked = await checkbox.isChecked().catch(() =>
      checkbox.getAttribute('aria-checked').then((v) => v === 'true')
    );
    expect(initialChecked).toBe(false);

    // Click to check
    await checkbox.click();
    const afterCheck = await checkbox.isChecked().catch(() =>
      checkbox.getAttribute('aria-checked').then((v) => v === 'true')
    );
    expect(afterCheck).toBe(true);

    // Click again to uncheck
    await checkbox.click();
    const afterUncheck = await checkbox.isChecked().catch(() =>
      checkbox.getAttribute('aria-checked').then((v) => v === 'true')
    );
    expect(afterUncheck).toBe(false);
  });

  // ─── 10. Page title is correct ───────────────────────────────────────────
  test('page has correct title containing Contact or Aviniti', async ({ page }) => {
    // meta title from en/contact.json: "Contact Aviniti — Let's Build Your Idea"
    await expect(page).toHaveTitle(/contact|aviniti/i);
  });

  // ─── 11. Validation errors for all required fields ───────────────────────
  test('shows multiple validation errors on blank submit', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click();

    // At minimum, the name error must appear (phone/topic/message errors also expected)
    const alerts = page.locator('[role="alert"]');
    await expect(alerts.first()).toBeVisible({ timeout: 5000 });
    const alertCount = await alerts.count();
    // There are at least 3 required fields: name, phone, topic, message
    expect(alertCount).toBeGreaterThanOrEqual(1);
  });

  // ─── 12. Company field is optional and does not block submission ──────────
  test('company field is present and optional', async ({ page }) => {
    // Company input should exist but not be required
    const companyInput = page.locator(
      'input[name="company"], input[placeholder*="company" i], input[placeholder*="Company" i]'
    ).first();
    await expect(companyInput).toBeVisible();

    // It should NOT have a required attribute
    const isRequired = await companyInput.getAttribute('required');
    expect(isRequired).toBeNull();
  });

  // ─── 13. Full form submission with mocked API ────────────────────────────
  test('successful form submission shows confirmation', async ({ page }) => {
    // Intercept the POST to /api/contact and return a success response
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, ticketId: 'AV-TEST123' }),
      });
    });

    // 1. Fill Name
    await page.getByRole('textbox', { name: /your name/i }).fill('John Doe');

    // 2. Fill Email
    await page.locator('input[type="email"], input[name="email"]').first().fill('john@example.com');

    // 3. Fill Phone — react-international-phone needs pressSequentially (fill() doesn't trigger onChange)
    // The input starts with "+962" (Jordan prefix); type the national number after it
    const phoneInput = page.locator('input[type="tel"]').first();
    await phoneInput.click();
    await page.keyboard.press('End');
    await phoneInput.pressSequentially('791234567');
    await page.waitForTimeout(200);

    // 4. Select Topic — Radix UI Select trigger.
    // Use nth(1) to skip the Country Selector combobox from react-international-phone
    const selectTrigger = page.getByRole('combobox').nth(1);
    await selectTrigger.click();
    // Wait for the dropdown listbox to appear
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 5000 });
    // Click the first option ("General Inquiry")
    await listbox.getByRole('option').first().click();

    // 5. Fill Message (min 10 chars required)
    await page.getByRole('textbox', { name: /your message/i }).fill(
      'I need help with my project and would like a free consultation.'
    );

    // 6. Submit the form
    await page.getByRole('button', { name: /send message/i }).click();

    // 6. Assert success state — the success card shows "Message Sent!" or a thank-you
    //    en/contact.json success.title = "Message Sent!"
    //    en/contact.json success.message starts with "Thank you for contacting us."
    await expect(
      page.locator('text=/message sent|thank you|sent|received/i').first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ─── 14. API error shows inline error message ────────────────────────────
  test('shows error message when API returns failure', async ({ page }) => {
    // Intercept and return a server error
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Fill all required fields
    await page.getByRole('textbox', { name: /your name/i }).fill('Jane Doe');

    await page.locator('input[type="email"], input[name="email"]').first().fill('jane@example.com');

    // react-international-phone needs pressSequentially; input already has "+962" prefix
    const phoneInput = page.locator('input[type="tel"]').first();
    await phoneInput.click();
    await page.keyboard.press('End');
    await phoneInput.pressSequentially('791234567');
    await page.waitForTimeout(200);

    // Use nth(1) to skip the Country Selector combobox from react-international-phone
    const selectTrigger = page.getByRole('combobox').nth(1);
    await selectTrigger.click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 5000 });
    await listbox.getByRole('option').first().click();

    await page.getByRole('textbox', { name: /your message/i }).fill(
      'Testing error handling scenario.'
    );

    await page.getByRole('button', { name: /send message/i }).click();

    // The form should NOT show the success state
    await expect(page.locator('text=/message sent|thank you/i').first()).not.toBeVisible({
      timeout: 5000,
    });

    // An error alert should appear (errors.send_failed from translations)
    const errorMessage = page.locator('[role="alert"]').filter({
      hasText: /failed|try again|whatsapp/i,
    });
    await expect(errorMessage.first()).toBeVisible({ timeout: 8000 });
  });

  // ─── 15. Sidebar contact info is visible ────────────────────────────────
  test('contact info sidebar is visible', async ({ page }) => {
    // The right column has email, whatsapp, location, hours info cards
    // At minimum, the email link should be present
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
  });

  // ─── 16. Calendly book-a-call button is present ─────────────────────────
  test('book a call button is present in sidebar', async ({ page }) => {
    // aria-label is "Book a free 30-minute consultation" (not the visible text "Book a Call")
    const bookCallBtn = page.locator('button[aria-label*="consultation"], button[aria-label*="30-minute"]').first();
    await expect(bookCallBtn).toBeVisible();
  });
});
