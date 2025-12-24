const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/סובלאקי יווני|Greek Souvlaki/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display hero section with content', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    // Check hero content - uses h1, not h2
    await expect(page.locator('.hero-content h1')).toBeVisible();
    // There are multiple p elements, use first()
    await expect(page.locator('.hero-content p').first()).toBeVisible();
    await expect(page.locator('.hero-cta-btn')).toBeVisible();
  });

  // Note: No separate Greek flag image element in current HTML
  // The site references Greek theming throughout but uses text/cultural elements

  test('should have correct RTL direction for Hebrew', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('should display all main sections', async ({ page }) => {
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    const nav = page.locator('.navbar');
    await expect(nav).toBeVisible();

    // Check navigation dropdown toggle exists
    await expect(page.locator('.nav-dropdown-toggle')).toBeVisible();

    // Check navigation links exist (they're in a dropdown panel)
    const navLinks = page.locator('.nav-dropdown-panel a');
    await expect(navLinks).toHaveCount(6); // home, menu, gallery, about, faq, contact
  });

  // Note: No separate logo-img class in current HTML
  // Logo is referenced in favicon/apple-touch-icon meta tags

  test('should have meta description', async ({ page }) => {
    const metaDescription = await page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('should load without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });
});
