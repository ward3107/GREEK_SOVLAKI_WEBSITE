const { test, expect } = require('@playwright/test');

test.describe('PWA Functionality Tests @pwa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have manifest file', async ({ page }) => {
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', 'manifest.json');
  });

  test('manifest.json should be accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/manifest.json');
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.icons).toBeTruthy();
  });

  test('should have apple-mobile-web-app-capable meta tag', async ({ page }) => {
    const meta = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(meta).toHaveAttribute('content', 'yes');
  });

  test('should have apple-touch-icon', async ({ page }) => {
    const icon = page.locator('link[rel="apple-touch-icon"]');
    await expect(icon).toHaveAttribute('href');
  });

  test('should have theme-color meta tag', async ({ page }) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content');
  });

  test('should register service worker', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration !== undefined;
      }
      return false;
    });

    expect(swRegistered).toBeTruthy();
  });

  test('service worker should cache important files', async ({ page, context }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if files are in cache
    const cacheHasFiles = await page.evaluate(async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        if (cacheNames.length > 0) {
          const cache = await caches.open(cacheNames[0]);
          const keys = await cache.keys();
          return keys.length > 0;
        }
      }
      return false;
    });

    expect(cacheHasFiles).toBeTruthy();
  });

  test('should work offline after first load', async ({ page, context }) => {
    // First load - online
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Page should still load (from cache)
    const title = await page.title();
    expect(title).toContain('Greek Souvlaki');

    // Go back online
    await context.setOffline(false);
  });

  test('should have viewport meta tag', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content');
  });

  test('manifest should have required PWA fields', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/manifest.json');
    const manifest = await response.json();

    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('icons');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('background_color');
    expect(manifest).toHaveProperty('theme_color');
  });

  test('manifest icons should have required sizes', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/manifest.json');
    const manifest = await response.json();

    expect(manifest.icons).toBeInstanceOf(Array);
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Check for common PWA icon sizes
    const hasRequiredSizes = manifest.icons.some(icon =>
      icon.sizes.includes('192') || icon.sizes.includes('512')
    );
    expect(hasRequiredSizes).toBeTruthy();
  });
});
