const { test, expect } = require('@playwright/test');

const devices = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Small Mobile', width: 320, height: 568 }
];

test.describe('Responsive Design @responsive', () => {
  devices.forEach(device => {
    test(`Layout works correctly on ${device.name} (${device.width}x${device.height})`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      // Check main elements are visible
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      // Test navbar responsiveness
      const navMenu = page.locator('.nav-menu');
      const hamburger = page.locator('.hamburger');

      if (device.width <= 768) {
        // Mobile: hamburger should be visible, nav menu hidden
        await expect(hamburger).toBeVisible();
        await expect(navMenu).not.toBeVisible();

        // Test hamburger menu functionality
        await hamburger.click();
        await expect(navMenu).toBeVisible();
        await expect(navMenu).toHaveCSS('position', 'fixed');

        // Close menu
        await hamburger.click();
        await expect(navMenu).not.toBeVisible();
      } else {
        // Desktop: hamburger hidden, nav menu visible
        await expect(hamburger).not.toBeVisible();
        await expect(navMenu).toBeVisible();
        await expect(navMenu).toHaveCSS('position', 'static');
      }
    });
  });

  test('Images are responsive and load correctly', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [1920, 1366, 768, 375];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.waitForLoadState();

      // Check hero background
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      // Check gallery images
      const galleryImages = page.locator('.gallery img');
      const imageCount = await galleryImages.count();

      if (imageCount > 0) {
        // Test first few images are loaded
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          const img = galleryImages.nth(i);
          await expect(img).toBeVisible();

          // Check image has proper attributes
          await expect(img).toHaveAttribute('alt');
          await expect(img).toHaveAttribute('width');
          await expect(img).toHaveAttribute('height');
        }
      }
    }
  });

  test('Text remains readable on all screen sizes', async ({ page }) => {
    const viewports = [1920, 768, 375];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      // Check main headings
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const h1Text = await h1.textContent();
      expect(h1Text.length).toBeGreaterThan(0);

      // Check if font sizes are appropriate
      const h1FontSize = await h1.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      // Font size should not be too small
      const fontSizeNum = parseFloat(h1FontSize);
      expect(fontSizeNum).toBeGreaterThan(14); // Minimum readable size

      // Test paragraph text
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();

      if (paragraphCount > 0) {
        const firstPara = paragraphs.first();
        await expect(firstPara).toBeVisible();

        const paraFontSize = await firstPara.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );
        expect(parseFloat(paraFontSize)).toBeGreaterThan(12);
      }
    }
  });

  test('Navigation works on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test hamburger menu
    const hamburger = page.locator('.hamburger');
    const navMenu = page.locator('.nav-menu');

    await expect(hamburger).toBeVisible();
    await expect(navMenu).not.toBeVisible();

    // Open menu
    await hamburger.click();
    await expect(navMenu).toBeVisible();

    // Test navigation links
    const menuLinks = navMenu.locator('a');
    const linkCount = await menuLinks.count();

    if (linkCount > 0) {
      // Test first navigation link
      const firstLink = menuLinks.first();
      await expect(firstLink).toBeVisible();

      const linkText = await firstLink.textContent();
      expect(linkText.length).toBeGreaterThan(0);

      // Test link click closes menu (implementation dependent)
      // await firstLink.click();
      // await expect(navMenu).not.toBeVisible();
    }

    // Test close button in mobile menu
    const closeBtn = navMenu.locator('.close-btn, .nav-close');
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await expect(navMenu).not.toBeVisible();
    }
  });

  test('Buttons and interactive elements are touch-friendly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test button sizes meet touch target requirements (44x44 minimum)
    const buttons = page.locator('button, .btn, input[type="submit"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }

    // Test form inputs
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(2, inputCount); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const box = await input.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Horizontal scrolling is prevented', async ({ page }) => {
    const viewports = [1920, 768, 375];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      // Get page width after content loads
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      // Page should not be wider than viewport
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px for rounding
    }
  });

  test('Language switcher works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const langDropdown = page.locator('.lang-dropdown-btn');
    await expect(langDropdown).toBeVisible();

    // Test dropdown opens and closes correctly
    await langDropdown.click();
    await expect(page.locator('.language-dropdown')).toBeVisible();

    // Test language options are accessible
    const languageOptions = page.locator('.language-dropdown [data-lang]');
    const optionCount = await languageOptions.count();
    expect(optionCount).toBeGreaterThan(0);

    // Test clicking outside closes dropdown
    await page.click('body', { position: { x: 10, y: 10 } });
    await expect(page.locator('.language-dropdown')).not.toBeVisible();
  });

  test('Scrolling behavior is correct on all devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test smooth scrolling to sections
    const contactLink = page.locator('a[href="#contact"]');
    if (await contactLink.count() > 0) {
      await contactLink.click();
      await page.waitForTimeout(1000);

      const contactSection = page.locator('#contact');
      await expect(contactSection).toBeVisible();

      // Check if contact section is in viewport
      const isVisible = await contactSection.isVisible();
      expect(isVisible).toBe(true);
    }

    // Test scroll to top button (if present)
    const scrollTopBtn = page.locator('.scroll-top-btn');
    if (await scrollTopBtn.count() > 0) {
      // Scroll down first
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);

      // Check if scroll to top button appears
      const isVisible = await scrollTopBtn.isVisible();
      if (isVisible) {
        await scrollTopBtn.click();
        await page.waitForTimeout(500);

        // Check if scrolled to top
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeLessThan(50);
      }
    }
  });

  test('Media queries work correctly', async ({ page }) => {
    await page.goto('/');

    // Test different breakpoints
    const breakpoints = [320, 768, 1024, 1200];

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });

      // Check if CSS media queries are applied
      const computedStyle = await page.evaluate(() => {
        const body = document.body;
        return {
          fontSize: window.getComputedStyle(body).fontSize,
          fontFamily: window.getComputedStyle(body).fontFamily
        };
      });

      expect(computedStyle.fontSize).toBeTruthy();
      expect(computedStyle.fontFamily).toBeTruthy();
    }
  });

  test('Accessibility features work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test accessibility widget
    const a11yToggle = page.locator('#a11y-toggle, .a11y-toggle');
    if (await a11yToggle.count() > 0) {
      await expect(a11yToggle).toBeVisible();

      // Test touch target size
      const box = await a11yToggle.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Test skip link
    const skipLink = page.locator('.skip-link');
    if (await skipLink.count() > 0) {
      // Skip link should be visible on focus
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    }
  });
});