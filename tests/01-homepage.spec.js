const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Greek Souvlaki/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display hero section with content', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    // Check hero content
    await expect(page.locator('.hero-content h2')).toBeVisible();
    await expect(page.locator('.hero-content p')).toBeVisible();
    await expect(page.locator('.cta-btn')).toBeVisible();
  });

  test('should display Greek flag', async ({ page }) => {
    const flag = page.locator('.greek-flag img');
    await expect(flag).toBeVisible();
    await expect(flag).toHaveAttribute('alt', 'Greek Flag');
  });

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

    // Check navigation links
    await expect(page.locator('a[href="#home"]')).toBeVisible();
    await expect(page.locator('a[href="#menu"]')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
    await expect(page.locator('a[href="#gallery"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  test('should display restaurant logo', async ({ page }) => {
    const logo = page.locator('.logo-img');
    await expect(logo).toBeVisible();
  });

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
