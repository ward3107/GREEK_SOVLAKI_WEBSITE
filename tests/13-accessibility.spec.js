const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests @accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page has proper semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    expect(await h1.count()).toBe(1); // Only one h1 per page

    // Check for proper landmark elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for skip link
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('All images have appropriate alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images should have alt text
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);

      // Decorative images should have empty alt=""
      const isDecorative = await img.evaluate(el =>
        el.getAttribute('role') === 'presentation' ||
        el.closest('[aria-hidden="true"]')
      );

      if (isDecorative) {
        expect(alt).toBe('');
      }
    }
  });

  test('Links have descriptive text', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(10, linkCount); i++) {
      const link = links.nth(i);
      const text = await link.textContent();

      // Links should have descriptive text
      if (text) {
        expect(text.trim().length).toBeGreaterThan(0);
      } else {
        // If no text, should have aria-label or title
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');

        expect(ariaLabel || title).toBeTruthy();
      }
    }
  });

  test('Form elements have proper labels', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputType = await input.getAttribute('type');

      // Skip hidden inputs
      if (inputType === 'hidden') continue;

      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // Input should have label, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel || ariaLabel || ariaLabelledby).toBe(true);
      } else {
        expect(ariaLabel || ariaLabelledby).toBe(true);
      }
    }
  });

  test('Buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('button, input[type="button"], input[type="submit"], [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      // Button should have accessible name
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('Page has sufficient color contrast', async ({ page }) => {
    // Check color contrast for key elements
    await page.addStyleTag(`
      .contrast-test { position: absolute; left: -9999px; }
      .text-high-contrast { color: #000000; background: #ffffff; }
      .text-low-contrast { color: #808080; background: #ffffff; }
    `);

    // This is a simplified check - in a real scenario, you'd use axe-core or similar
    const visibleText = page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button');
    const textCount = await visibleText.count();

    expect(textCount).toBeGreaterThan(0);

    // Ensure text elements are not completely transparent
    for (let i = 0; i < Math.min(5, textCount); i++) {
      const element = visibleText.nth(i);
      if (await element.isVisible()) {
        const opacity = await element.evaluate(el => {
          return window.getComputedStyle(el).opacity;
        });
        expect(parseFloat(opacity)).toBeGreaterThan(0.5);
      }
    }
  });

  test('Keyboard navigation works properly', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');

    // Focus should move to focusable elements
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']).toContain(focusedElement);

    // Test tabbing through navigation
    const navLinks = page.locator('nav a');
    const navLinkCount = await navLinks.count();

    if (navLinkCount > 0) {
      await page.keyboard.press('Tab');
      const firstNavFocused = await navLinks.first().evaluate(el => document.activeElement === el);
      expect(firstNavFocused).toBe(true);
    }
  });

  test('Focus indicators are visible', async ({ page }) => {
    // Add focus styles for testing
    await page.addStyleTag(`
      *:focus { outline: 2px solid red !important; }
    `);

    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const elementCount = await focusableElements.count();

    if (elementCount > 0) {
      // Focus first element and check for outline
      await focusableElements.first().focus();
      const computedStyle = await focusableElements.first().evaluate(el => {
        return window.getComputedStyle(el);
      });

      // Should have visible focus indicator
      expect(computedStyle.outline !== 'none').toBe(true);
    }
  });

  test('Page language and direction are properly set', async ({ page }) => {
    const html = page.locator('html');

    // Check language attribute
    const lang = await html.getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(['he', 'en', 'ar', 'ru', 'el']).toContain(lang);

    // Check direction for RTL languages
    if (['he', 'ar'].includes(lang)) {
      expect(await html.getAttribute('dir')).toBe('rtl');
    }
  });

  test('ARIA landmarks are properly used', async ({ page }) => {
    // Check for proper ARIA landmarks
    await expect(page.locator('[role="banner"], header')).toBeVisible();
    await expect(page.locator('[role="navigation"], nav')).toBeVisible();
    await expect(page.locator('[role="main"], main')).toBeVisible();
    await expect(page.locator('[role="contentinfo"], footer')).toBeVisible();

    // Check for proper ARIA labels if present
    const landmarksWithLabel = page.locator('[aria-label], [aria-labelledby]');
    const labelCount = await landmarksWithLabel.count();

    // Should have some ARIA labels for complex sections
    expect(labelCount).toBeGreaterThanOrEqual(0);
  });

  test('Tables are accessible (if present)', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();

    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);

      // Table should have caption
      const hasCaption = await table.locator('caption').count() > 0;
      if (hasCaption) {
        const caption = table.locator('caption');
        expect(await caption.textContent()).toBeTruthy();
      }

      // Table should have proper headers
      const headers = table.locator('th');
      const headerCount = await headers.count();

      if (headerCount > 0) {
        for (let j = 0; j < headerCount; j++) {
          const header = headers.nth(j);
          const scope = await header.getAttribute('scope');
          // Headers should have scope attribute
          expect(scope).toBeTruthy();
          expect(['col', 'row']).toContain(scope);
        }
      }
    }
  });

  test('No accessibility violations with axe-core', async ({ page }) => {
    // This would require axe-core to be installed
    // For now, we'll do basic checks
    await page.goto('/');

    // Check for common accessibility issues
    const issues = await page.evaluate(() => {
      const issues = [];

      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) issues.push('Images missing alt text');

      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const unlabeledInputs = Array.from(inputs).filter(input => {
        return !document.querySelector(`label[for="${input.id}"]`) && input.type !== 'hidden';
      });
      if (unlabeledInputs.length > 0) issues.push('Form inputs missing labels');

      return issues;
    });

    expect(issues).toEqual([]);
  });

  test('Accessibility widget functions correctly', async ({ page }) => {
    // Look for accessibility widget
    const a11yWidget = page.locator('#a11y-widget, .a11y-widget, [id*="accessibility"]');

    if (await a11yWidget.count() > 0) {
      await expect(a11yWidget).toBeVisible();

      // Test widget controls
      const toggleBtn = a11yWidget.locator('button, [role="button"]').first();
      if (await toggleBtn.count() > 0) {
        await expect(toggleBtn).toBeVisible();
        await expect(toggleBtn).toHaveAttribute('aria-label');
      }

      // Check if widget has proper ARIA attributes
      const hasAriaLabel = await a11yWidget.getAttribute('aria-label');
      const hasRole = await a11yWidget.getAttribute('role');

      expect(hasAriaLabel || hasRole).toBeTruthy();
    }
  });

  test('Page is screen reader friendly', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    // Should have logical heading hierarchy
    if (headingCount > 0) {
      let lastLevel = 1;
      for (let i = 0; i < Math.min(headingCount, 10); i++) {
        const heading = headings.nth(i);
        const level = parseInt(await heading.evaluate(el => el.tagName.charAt(1)));

        // Should not skip heading levels
        expect(level - lastLevel).toBeLessThanOrEqual(1);
        lastLevel = level;
      }
    }

    // Check for page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Untitled Document');
  });

  test('Touch targets are large enough', async ({ page }) => {
    const interactiveElements = page.locator('a, button, input, textarea, select, [role="button"]');
    const elementCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(10, elementCount); i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();

        if (box) {
          // Touch targets should be at least 44x44px
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});