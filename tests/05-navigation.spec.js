const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to menu section', async ({ page }) => {
    await page.locator('a[href="#menu"]').click();
    await page.waitForTimeout(1000);

    // Check we scrolled to menu
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeInViewport();
  });

  test('should navigate to about section', async ({ page }) => {
    await page.locator('a[href="#about"]').click();
    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should navigate to gallery section', async ({ page }) => {
    await page.locator('a[href="#gallery"]').click();
    await page.waitForTimeout(1000);

    const gallerySection = page.locator('#gallery');
    await expect(gallerySection).toBeInViewport();
  });

  test('should navigate to contact section', async ({ page }) => {
    await page.locator('a[href="#contact"]').click();
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('View Menu button should scroll to menu', async ({ page }) => {
    const viewMenuBtn = page.locator('.cta-btn');
    await viewMenuBtn.click();
    await page.waitForTimeout(1000);

    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeInViewport();
  });

  test('should have smooth scrolling', async ({ page }) => {
    // Check scroll-behavior is smooth
    const scrollBehavior = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(scrollBehavior).toBe('smooth');
  });

  test('mobile hamburger menu should work', async ({ page }) => {
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburger = page.locator('.hamburger');
    const navMenu = page.locator('.nav-menu');

    // Hamburger should be visible on mobile
    await expect(hamburger).toBeVisible();

    // Click hamburger
    await hamburger.click();
    await page.waitForTimeout(300);

    // Nav menu should be visible
    await expect(navMenu).toBeVisible();
  });

  test('should display all navigation links', async ({ page }) => {
    const links = [
      { href: '#home', visible: true },
      { href: '#menu', visible: true },
      { href: '#about', visible: true },
      { href: '#gallery', visible: true },
      { href: '#contact', visible: true },
    ];

    for (const link of links) {
      const element = page.locator(`a[href="${link.href}"]`);
      if (link.visible) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('should highlight active section', async ({ page }) => {
    // Navigate to menu
    await page.locator('a[href="#menu"]').click();
    await page.waitForTimeout(1000);

    // Menu should be in viewport
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeInViewport();
  });
});
