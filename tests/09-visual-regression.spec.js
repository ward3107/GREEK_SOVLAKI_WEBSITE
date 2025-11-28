const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('homepage should match snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('hero section should match snapshot', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toHaveScreenshot('hero-section.png');
  });

  test('menu section should match snapshot', async ({ page }) => {
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const menu = page.locator('#menu');
    await expect(menu).toHaveScreenshot('menu-section.png');
  });

  test('about section should match snapshot', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const about = page.locator('#about');
    await expect(about).toHaveScreenshot('about-section.png');
  });

  test('gallery section should match snapshot', async ({ page }) => {
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const gallery = page.locator('#gallery');
    await expect(gallery).toHaveScreenshot('gallery-section.png');
  });

  test('contact section should match snapshot', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const contact = page.locator('#contact');
    await expect(contact).toHaveScreenshot('contact-section.png');
  });

  test('footer should match snapshot', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(footer).toHaveScreenshot('footer.png');
  });

  test('navigation bar should match snapshot', async ({ page }) => {
    const navbar = page.locator('.navbar');
    await expect(navbar).toHaveScreenshot('navbar.png');
  });

  test('mobile view should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tablet view should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('tablet-view.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('English language should match snapshot', async ({ page }) => {
    // Switch to English
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-lang-switch="en"]').click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-english.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('accessibility widget open should match snapshot', async ({ page }) => {
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);

    const widget = page.locator('.a11y-widget');
    await expect(widget).toHaveScreenshot('accessibility-widget-open.png');
  });

  test('language dropdown open should match snapshot', async ({ page }) => {
    await page.locator('.lang-dropdown-btn').click();
    await page.waitForTimeout(300);

    const dropdown = page.locator('.language-dropdown');
    await expect(dropdown).toHaveScreenshot('language-dropdown-open.png');
  });
});
