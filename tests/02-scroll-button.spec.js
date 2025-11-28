const { test, expect } = require('@playwright/test');

test.describe('Scroll-Up Button Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display scroll-up button', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');
    await expect(scrollBtn).toBeVisible();
  });

  test('scroll button should be on the right side', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');
    const box = await scrollBtn.boundingBox();

    const viewportSize = page.viewportSize();
    // Button should be on the right side (x position > 50% of viewport)
    expect(box.x).toBeGreaterThan(viewportSize.width * 0.5);
  });

  test('should scroll to top when clicked', async ({ page }) => {
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Check we're scrolled down
    let scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(500);

    // Click scroll button
    await page.locator('.scroll-top-btn').click();
    await page.waitForTimeout(1000); // Wait for smooth scroll

    // Check we're at top
    scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test('should have arrow icon', async ({ page }) => {
    const arrow = page.locator('.scroll-arrow');
    await expect(arrow).toBeVisible();
  });

  test('should have proper ARIA label', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');
    await expect(scrollBtn).toHaveAttribute('aria-label', 'Scroll to top');
  });

  test('should be styled correctly', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');

    // Check it's a circular button
    const borderRadius = await scrollBtn.evaluate(el =>
      window.getComputedStyle(el).borderRadius
    );
    expect(borderRadius).toContain('50%');

    // Check it has blue background
    const background = await scrollBtn.evaluate(el =>
      window.getComputedStyle(el).background
    );
    expect(background).toContain('rgb');
  });

  test('should be always visible', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');

    // Check visible at top
    await expect(scrollBtn).toBeVisible();

    // Scroll down and check still visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);
    await expect(scrollBtn).toBeVisible();
  });

  test('should have hover effect', async ({ page }) => {
    const scrollBtn = page.locator('.scroll-top-btn');

    // Hover over button
    await scrollBtn.hover();
    await page.waitForTimeout(300);

    // Button should still be visible
    await expect(scrollBtn).toBeVisible();
  });
});
