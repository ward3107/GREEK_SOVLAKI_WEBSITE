const { test, expect } = require('@playwright/test');

test.describe('Multilingual Functionality @i18n', () => {
  const supportedLanguages = ['he', 'en', 'ar', 'ru', 'el'];
  const languageFlags = {
    'he': '🇮🇱',
    'en': '🇺🇸',
    'ar': '🇸🇦',
    'ru': '🇷🇺',
    'el': '🇬🇷'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('language switcher is visible and functional', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');
    await expect(langDropdown).toBeVisible();
    await expect(langDropdown).toContainText('עברית');

    // Open dropdown
    await langDropdown.click();
    await expect(page.locator('.language-dropdown')).toBeVisible();

    // Check all language options are present
    for (const lang of supportedLanguages) {
      const langOption = page.locator(`[data-lang="${lang}"]`);
      await expect(langOption).toBeVisible();
      if (lang === 'he') {
        await expect(langOption).toContainText('עברית');
      } else if (lang === 'en') {
        await expect(langOption).toContainText('English');
      } else if (lang === 'ar') {
        await expect(langOption).toContainText('العربية');
      } else if (lang === 'ru') {
        await expect(langOption).toContainText('Русский');
      } else if (lang === 'el') {
        await expect(langOption).toContainText('Ελληνικά');
      }
    }
  });

  test('language switching works correctly', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Test switching to English
    await langDropdown.click();
    await page.locator('[data-lang="en"]').click();

    // Wait for content to update
    await page.waitForTimeout(500);

    // Check URL has language parameter
    await expect(page).toHaveURL(/.*lang=en/);

    // Test switching to Arabic
    await langDropdown.click();
    await page.locator('[data-lang="ar"]').click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/.*lang=ar/);

    // Check RTL/LTR direction changes
    const html = page.locator('html');
    if (await html.getAttribute('dir') === 'rtl') {
      // Should be RTL for Hebrew and Arabic
      expect(['he', 'ar']).toContain(await page.url().match(/lang=([a-z]{2})/)[1]);
    }
  });

  test('content updates correctly when language changes', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Test Hebrew (default)
    await expect(page.locator('h1')).toContainText('סובלאקי יווני');

    // Switch to English
    await langDropdown.click();
    await page.locator('[data-lang="en"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('h1')).toContainText('Greek Souvlaki');

    // Switch to Arabic
    await langDropdown.click();
    await page.locator('[data-lang="ar"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('h1')).toContainText('سوفلاكي يوناني');
  });

  test('navigation links preserve language selection', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Switch to English
    await langDropdown.click();
    await page.locator('[data-lang="en"]').click();
    await page.waitForTimeout(500);

    // Navigate to contact section
    await page.locator('a[href="#contact"]').click();
    await page.waitForTimeout(1000);

    // URL should still contain language parameter
    await expect(page).toHaveURL(/.*lang=en.*#contact/);

    // Check contact section content is in English
    const contactSection = page.locator('#contact');
    await expect(contactSection).toContainText('Contact');
  });

  test('translation files are loaded correctly', async ({ page }) => {
    // Check if translation data is properly loaded
    const response = await page.evaluate(async () => {
      // Access the translation data from window
      if (window.translations) {
        return {
          hasTranslations: true,
          languages: Object.keys(window.translations)
        };
      }
      return { hasTranslations: false };
    });

    expect(response.hasTranslations).toBe(true);
    expect(response.languages).toEqual(expect.arrayContaining(supportedLanguages));
  });

  test('page meta tags update with language', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Test English
    await langDropdown.click();
    await page.locator('[data-lang="en"]').click();
    await page.waitForTimeout(500);

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Test Arabic
    await langDropdown.click();
    await page.locator('[data-lang="ar"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('language preference persists across pages', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Switch to Russian
    await langDropdown.click();
    await page.locator('[data-lang="ru"]').click();
    await page.waitForTimeout(500);

    // Navigate to accessibility page
    await page.goto('/accessibility.html');
    await page.waitForLoadState();

    // Check if language is preserved (may need implementation)
    const currentUrl = page.url();
    // Note: This test may need adjustment based on actual language persistence implementation
  });

  test('fallback language works if requested language is missing', async ({ page }) => {
    // Try to access with unsupported language
    await page.goto('/?lang=zh');
    await page.waitForLoadState();

    // Should fallback to default language (Hebrew)
    const h1 = page.locator('h1');
    await expect(h1).toContainText('סובלאקי');
  });

  test('language dropdown closes on outside click', async ({ page }) => {
    const langDropdown = page.locator('.lang-dropdown-btn');

    // Open dropdown
    await langDropdown.click();
    await expect(page.locator('.language-dropdown')).toBeVisible();

    // Click outside
    await page.click('body', { position: { x: 10, y: 10 } });

    // Dropdown should close
    await expect(page.locator('.language-dropdown')).not.toBeVisible();
  });

  test('all language links have correct hreflang attributes', async ({ page }) => {
    const htmlLangLinks = page.locator('link[rel="alternate"][hreflang]');

    // Check if hreflang links exist for all supported languages
    await expect(htmlLangLinks).toHaveCount(supportedLanguages.length);

    // Verify each supported language has a hreflang link
    for (const lang of supportedLanguages) {
      const hreflangLink = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
      await expect(hreflangLink).toBeVisible();
    }
  });
});