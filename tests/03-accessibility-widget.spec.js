const { test, expect } = require('@playwright/test');

test.describe('Accessibility Widget Tests @accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display accessibility widget button', async ({ page }) => {
    const widget = page.locator('.a11y-toggle');
    await expect(widget).toBeVisible();
  });

  test('accessibility widget should be on the left side', async ({ page }) => {
    const widget = page.locator('.a11y-widget');
    const box = await widget.boundingBox();

    // Widget should be on the left side (x position < 50% of viewport)
    const viewportSize = page.viewportSize();
    expect(box.x).toBeLessThan(viewportSize.width * 0.5);
  });

  test('should open panel when clicked', async ({ page }) => {
    const toggle = page.locator('.a11y-toggle');
    const panel = page.locator('.a11y-panel');

    // Panel should be hidden initially
    await expect(panel).not.toHaveClass(/open/);

    // Click to open
    await toggle.click();
    await page.waitForTimeout(500);

    // Panel should be visible
    await expect(panel).toHaveClass(/open/);
  });

  test('should close panel when close button clicked', async ({ page }) => {
    const toggle = page.locator('.a11y-toggle');
    const panel = page.locator('.a11y-panel');
    const closeBtn = page.locator('.a11y-close');

    // Open panel
    await toggle.click();
    await page.waitForTimeout(500);
    await expect(panel).toHaveClass(/open/);

    // Close panel
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(panel).not.toHaveClass(/open/);
  });

  test('should increase font size', async ({ page }) => {
    // Open widget
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);

    // Get initial font size
    const initialFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );

    // Click increase font size
    await page.locator('[data-action="increaseFontSize"]').click();
    await page.waitForTimeout(300);

    // Check font size increased
    const newFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );

    expect(parseFloat(newFontSize)).toBeGreaterThan(parseFloat(initialFontSize));
  });

  test('should decrease font size', async ({ page }) => {
    // Open widget
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);

    // First increase, then decrease
    await page.locator('[data-action="increaseFontSize"]').click();
    await page.waitForTimeout(300);

    const midFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );

    await page.locator('[data-action="decreaseFontSize"]').click();
    await page.waitForTimeout(300);

    const finalFontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );

    expect(parseFloat(finalFontSize)).toBeLessThan(parseFloat(midFontSize));
  });

  test('should apply high contrast', async ({ page }) => {
    // Open widget
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);

    // Click high contrast
    await page.locator('[data-action="highContrast"]').click();
    await page.waitForTimeout(300);

    // Check body has high contrast class
    const body = page.locator('body');
    await expect(body).toHaveClass(/a11y-high-contrast/);
  });

  test('should reset all settings', async ({ page }) => {
    // Open widget
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);

    // Make some changes
    await page.locator('[data-action="increaseFontSize"]').click();
    await page.locator('[data-action="highContrast"]').click();
    await page.waitForTimeout(500);

    // Reset
    await page.locator('[data-action="reset"]').click();
    await page.waitForTimeout(500);

    // Check font size is back to 100%
    const fontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );
    expect(fontSize).toBe('16px'); // Default

    // Check no contrast class
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/a11y-high-contrast/);
  });

  test('should persist settings in localStorage', async ({ page }) => {
    // Open widget and change font size
    await page.locator('.a11y-toggle').click();
    await page.waitForTimeout(500);
    await page.locator('[data-action="increaseFontSize"]').click();
    await page.waitForTimeout(500);

    // Check localStorage
    const savedFontSize = await page.evaluate(() =>
      localStorage.getItem('a11y-fontSize')
    );
    expect(savedFontSize).not.toBeNull();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Font size should still be increased
    const fontSize = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontSize
    );
    expect(parseFloat(fontSize)).toBeGreaterThan(16);
  });
});
