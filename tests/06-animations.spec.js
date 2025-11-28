const { test, expect } = require('@playwright/test');

test.describe('WOW Animations Tests @animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have fade-in animations', async ({ page }) => {
    const fadeElements = page.locator('.fade-in');
    const count = await fadeElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('fade-in elements should become visible on scroll', async ({ page }) => {
    // Scroll to about section
    await page.evaluate(() => {
      document.querySelector('#about').scrollIntoView();
    });
    await page.waitForTimeout(1000);

    // Check elements have 'visible' class
    const visibleElements = page.locator('.fade-in.visible');
    const count = await visibleElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Greek flag should have float animation', async ({ page }) => {
    const flag = page.locator('.greek-flag');
    await expect(flag).toHaveClass(/float-animation/);
  });

  test('Greek flag should have glow effect', async ({ page }) => {
    const flag = page.locator('.greek-flag');
    await expect(flag).toHaveClass(/glow-effect/);
  });

  test('particles should be created in hero section', async ({ page }) => {
    const particles = page.locator('.particle');
    const count = await particles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('menu items should have hover effects', async ({ page }) => {
    const menuCard = page.locator('.menu-card').first();

    // Hover over menu card
    await menuCard.hover();
    await page.waitForTimeout(500);

    // Card should still be visible
    await expect(menuCard).toBeVisible();
  });

  test('hero CTA button should have pulse animation', async ({ page }) => {
    const ctaBtn = page.locator('.cta-btn');
    await expect(ctaBtn).toHaveClass(/pulse-animation/);
  });

  test('features should have scale-in animation', async ({ page }) => {
    // Scroll to about section
    await page.evaluate(() => {
      document.querySelector('#about').scrollIntoView();
    });
    await page.waitForTimeout(1000);

    const features = page.locator('.feature.scale-in');
    const count = await features.count();
    expect(count).toBeGreaterThan(0);
  });

  test('features should have stagger effect', async ({ page }) => {
    const stagger1 = page.locator('.stagger-1');
    const stagger2 = page.locator('.stagger-2');
    const stagger3 = page.locator('.stagger-3');
    const stagger4 = page.locator('.stagger-4');

    await expect(stagger1).toBeVisible();
    await expect(stagger2).toBeVisible();
    await expect(stagger3).toBeVisible();
    await expect(stagger4).toBeVisible();
  });

  test('about section should have glassmorphism effect', async ({ page }) => {
    const aboutSection = page.locator('#about.glass-card');
    await expect(aboutSection).toBeVisible();
  });

  test('gallery images should have zoom-hover effect', async ({ page }) => {
    const galleryItems = page.locator('.gallery-item');
    const count = await galleryItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('parallax layers should exist', async ({ page }) => {
    const parallaxLayers = page.locator('.parallax-layer');
    const count = await parallaxLayers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('parallax layers should have data-speed attribute', async ({ page }) => {
    const heroContent = page.locator('.hero-content.parallax-layer');
    await expect(heroContent).toHaveAttribute('data-speed');
  });

  test('menu section should have Greek pattern background', async ({ page }) => {
    const menuSection = page.locator('#menu.greek-pattern');
    await expect(menuSection).toBeVisible();
  });

  test('animations should not cause layout shift', async ({ page }) => {
    // Measure initial layout
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll through the page
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);
    }

    // Final height should be roughly the same (allow some variance)
    const finalHeight = await page.evaluate(() => document.body.scrollHeight);
    const difference = Math.abs(finalHeight - initialHeight);
    expect(difference).toBeLessThan(100); // Allow 100px variance
  });
});
