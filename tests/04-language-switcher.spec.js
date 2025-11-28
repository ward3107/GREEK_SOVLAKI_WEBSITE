const { test, expect } = require('@playwright/test');

test.describe('Language Switcher Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display language dropdown', async ({ page }) => {
    const langDropdown = page.locator('.language-dropdown');
    await expect(langDropdown).toBeVisible();
  });

  test('should show current language (Hebrew by default)', async ({ page }) => {
    const currentLang = page.locator('.current-lang');
    await expect(currentLang).toContainText('HE');
  });

  test('should open language menu when clicked', async ({ page }) => {
    const dropdownBtn = page.locator('.lang-dropdown-btn');
    const dropdown = page.locator('.language-dropdown-content');

    // Click to open
    await dropdownBtn.click();
    await page.waitForTimeout(300);

    // Check if visible
    await expect(dropdown).toBeVisible();
  });

  test('should display all language options', async ({ page }) => {
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);

    await expect(page.locator('[data-lang-switch="he"]')).toBeVisible();
    await expect(page.locator('[data-lang-switch="en"]')).toBeVisible();
    await expect(page.locator('[data-lang-switch="ar"]')).toBeVisible();
    await expect(page.locator('[data-lang-switch="ru"]')).toBeVisible();
  });

  test('should switch to English', async ({ page }) => {
    // Open dropdown
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);

    // Click English
    await page.locator('[data-lang-switch="en"]').click();
    await page.waitForTimeout(500);

    // Check direction changed to LTR
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');

    // Check language code
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should switch to Arabic (RTL)', async ({ page }) => {
    // Open dropdown
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);

    // Click Arabic
    await page.locator('[data-lang-switch="ar"]').click();
    await page.waitForTimeout(500);

    // Check direction is RTL
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('should switch to Russian (LTR)', async ({ page }) => {
    // Open dropdown
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);

    // Click Russian
    await page.locator('[data-lang-switch="ru"]').click();
    await page.waitForTimeout(500);

    // Check direction is LTR
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'ru');
  });

  test('should update active language button', async ({ page }) => {
    // Initially Hebrew should be active
    await expect(page.locator('[data-lang-switch="he"]')).toHaveClass(/active/);

    // Switch to English
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-lang-switch="en"]').click();
    await page.waitForTimeout(500);

    // English should be active
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-lang-switch="en"]')).toHaveClass(/active/);
  });

  test('should persist language selection', async ({ page }) => {
    // Switch to English
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-lang-switch="en"]').click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Should still be English (LTR)
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
  });
});
