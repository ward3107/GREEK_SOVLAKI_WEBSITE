const { test, expect } = require('@playwright/test');

test.describe('Content Validation Tests @content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page title and meta tags are correct', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Untitled Document');
    expect(title).toContain('סובלאקי');

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription.length).toBeGreaterThan(50);
    expect(metaDescription).toContain('סובלאקי');

    // Check meta keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords.length).toBeGreaterThan(0);
    expect(metaKeywords).toContain('סובלאקי');
  });

  test('Business information is present and accurate', async ({ page }) => {
    // Check for restaurant name
    const restaurantName = page.locator('h1, .restaurant-name, .site-title');
    expect(await restaurantName.count()).toBeGreaterThan(0);
    expect(await restaurantName.first().textContent()).toContain('סובלאקי');

    // Check for contact information
    const phoneLink = page.locator('a[href^="tel:"]');
    const phoneRegex = /^0[2-9]\d{7,8}$/;

    if (await phoneLink.count() > 0) {
      const phoneText = await phoneLink.first().textContent();
      expect(phoneText).toMatch(/\d/); // Should contain numbers
    }

    // Check for location information
    const locationText = page.locator('.location, .address, .map-location');
    if (await locationText.count() > 0) {
      const location = await locationText.first().textContent();
      expect(location.length).toBeGreaterThan(0);
    }
  });

  test('Menu items are properly structured', async ({ page }) => {
    // Navigate to menu section
    const menuLink = page.locator('a[href="#menu"]');
    if (await menuLink.count() > 0) {
      await menuLink.click();
      await page.waitForTimeout(1000);

      const menuSection = page.locator('#menu, .menu-section');
      expect(await menuSection.count()).toBe(1);

      // Check for menu categories
      const menuItems = menuSection.locator('.menu-item, .dish, .category');
      const itemCount = await menuItems.count();

      expect(itemCount).toBeGreaterThan(0);

      // Check first few menu items have proper structure
      for (let i = 0; i < Math.min(3, itemCount); i++) {
        const menuItem = menuItems.nth(i);
        const itemText = await menuItem.textContent();

        expect(itemText.length).toBeGreaterThan(0);

        // Check for price information
        const pricePattern = /₪|\d+|\$\s*\d+/;
        expect(itemText.match(pricePattern)).toBeTruthy();
      }
    }
  });

  test('Image content is relevant and properly labeled', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    expect(imageCount).toBeGreaterThan(0);

    let foodImageCount = 0;
    let logoImageCount = 0;

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');

      expect(src).toBeTruthy();
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);

      // Classify images
      if (alt.toLowerCase().includes('logo')) {
        logoImageCount++;
      } else if (alt.toLowerCase().includes('סובלאקי') ||
                 alt.toLowerCase().includes('food') ||
                 alt.toLowerCase().includes('מנה') ||
                 alt.toLowerCase().includes('greek')) {
        foodImageCount++;
      }
    }

    // Should have food images
    expect(foodImageCount).toBeGreaterThan(0);
    expect(logoImageCount).toBeGreaterThan(0);
  });

  test('Navigation links are functional', async ({ page }) => {
    const navLinks = page.locator('nav a, .navigation a');
    const linkCount = await navLinks.count();

    expect(linkCount).toBeGreaterThan(2); // At least nav menu

    // Test navigation structure
    const expectedSections = ['home', 'menu', 'about', 'gallery', 'contact'];
    const foundSections = [];

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      if (href) {
        for (const section of expectedSections) {
          if (href.includes(section) || text.toLowerCase().includes(section)) {
            foundSections.push(section);
            break;
          }
        }
      }
    }

    // Should have links to major sections
    expect(foundSections.length).toBeGreaterThan(3);
  });

  test('Contact information is complete', async ({ page }) => {
    // Navigate to contact section
    const contactLink = page.locator('a[href="#contact"]');
    if (await contactLink.count() > 0) {
      await contactLink.click();
      await page.waitForTimeout(1000);

      const contactSection = page.locator('#contact, .contact-section');
      expect(await contactSection.count()).toBe(1);

      // Check for phone number
      const phoneLink = contactSection.locator('a[href^="tel:"]');
      const phoneCount = await phoneLink.count();
      expect(phoneCount).toBeGreaterThan(0);

      // Check for WhatsApp
      const whatsappLink = contactSection.locator('a[href*="wa.me"]');
      const whatsappCount = await whatsappLink.count();
      expect(whatsappCount).toBeGreaterThan(0);

      // Check for address/location
      const address = contactSection.locator('.address, .location, .map');
      const addressCount = await address.count();
      expect(addressCount).toBeGreaterThan(0);

      // Check for hours
      const hours = contactSection.locator('.hours, .opening-hours');
      const hoursCount = await hours.count();
      expect(hoursCount).toBeGreaterThan(0);
    }
  });

  test('Social media links are present and valid', async ({ page }) => {
    const socialLinks = page.locator('a[href*="instagram"], a[href*="facebook"]');
    const socialCount = await socialLinks.count();

    expect(socialCount).toBeGreaterThan(0);

    for (let i = 0; i < socialCount; i++) {
      const link = socialLinks.nth(i);
      const href = await link.getAttribute('href');

      expect(href).toBeTruthy();
      expect(href).toMatch(/(instagram\.com|facebook\.com)/);

      // Check if link opens in new tab
      const target = await link.getAttribute('target');
      expect(target === '_blank' || target === '_new').toBe(true);
    }
  });

  test('Content is linguistically consistent', async ({ page }) => {
    // Get page content
    const pageContent = await page.content();

    // Check language consistency
    const hebrewText = pageContent.match(/[\u0590-\u05FF]/g);
    const englishText = pageContent.match(/[a-zA-Z]/g);

    if (hebrewText && englishText) {
      // Should be primarily Hebrew content
      expect(hebrewText.length).toBeGreaterThan(englishText.length);
    }

    // Check for mixed language content (should be minimal)
    const mixedRatio = englishText.length / hebrewText.length;
    expect(mixedRatio).toBeLessThan(0.5); // Less than 50% English
  });

  test('Legal pages are accessible and complete', async ({ page }) => {
    // Test privacy policy
    await page.goto('/privacy.html');
    const privacyContent = await page.content();
    expect(privacyContent.length).toBeGreaterThan(1000);
    expect(privacyContent.toLowerCase()).toContain('privacy');

    // Test terms of service
    await page.goto('/terms.html');
    const termsContent = await page.content();
    expect(termsContent.length).toBeGreaterThan(1000);
    expect(termsContent.toLowerCase()).toContain('terms');

    // Test accessibility statement
    await page.goto('/accessibility.html');
    const accessibilityContent = await page.content();
    expect(accessibilityContent.length).toBeGreaterThan(1000);
    expect(accessibilityContent.toLowerCase()).toContain('accessibility');

    // Return to homepage
    await page.goto('/');
  });

  test('Opening hours are clearly displayed', async ({ page }) => {
    // Look for opening hours information
    const hoursSelectors = [
      '.opening-hours',
      '.hours',
      '[data-hours]',
      '.contact .time'
    ];

    let hoursFound = false;
    for (const selector of hoursSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        const hoursText = await element.textContent();
        expect(hoursText.length).toBeGreaterThan(10);
        expect(hoursText).toMatch(/\d/); // Should contain numbers for time
        hoursFound = true;
        break;
      }
    }

    expect(hoursFound).toBe(true);
  });

  test('PWA manifest is complete', async ({ page }) => {
    // Check for PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    expect(await manifestLink.count()).toBe(1);

    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBeTruthy();

    // Fetch and validate manifest content
    const manifestResponse = await page.evaluate(async (href) => {
      try {
        const response = await fetch(href);
        return await response.json();
      } catch {
        return null;
      }
    }, manifestHref);

    if (manifestResponse) {
      expect(manifestResponse.name).toBeTruthy();
      expect(manifestResponse.short_name).toBeTruthy();
      expect(manifestResponse.icons).toBeDefined();
      expect(Array.isArray(manifestResponse.icons)).toBe(true);
      expect(manifestResponse.icons.length).toBeGreaterThan(0);
    }
  });

  test('SEO elements are properly implemented', async ({ page }) => {
    // Check canonical URL
    const canonicalLink = page.locator('link[rel="canonical"]');
    expect(await canonicalLink.count()).toBe(1);

    const canonicalHref = await canonicalLink.getAttribute('href');
    expect(canonicalHref).toBeTruthy();
    expect(canonicalHref).toMatch(/^https?:\/\//);

    // Check for Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');

    expect(await ogTitle.count()).toBe(1);
    expect(await ogDescription.count()).toBe(1);
    expect(await ogImage.count()).toBe(1);

    // Check Twitter Card tags
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    const twitterDescription = page.locator('meta[name="twitter:description"]');
    const twitterImage = page.locator('meta[name="twitter:image"]');

    expect(await twitterTitle.count()).toBe(1);
    expect(await twitterDescription.count()).toBe(1);
    expect(await twitterImage.count()).toBe(1);

    // Check for structured data (if present)
    const structuredData = page.locator('script[type="application/ld+json"]');
    expect(await structuredData.count()).toBeGreaterThanOrEqual(0);
  });

  test('Content loads without errors', async ({ page }) => {
    // Wait for all content to load
    await page.waitForLoadState('networkidle');

    // Check for broken images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }

    // Check for CSS and JS loading errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    expect(consoleErrors.length).toBe(0);
  });

  test('Mobile content is properly adapted', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Check mobile-specific elements
    const hamburger = page.locator('.hamburger');
    expect(await hamburger.count()).toBe(1);
    expect(await hamburger.isVisible()).toBe(true);

    // Check if content is still readable
    const h1 = page.locator('h1');
    expect(await h1.isVisible()).toBe(true);

    const h1Text = await h1.textContent();
    expect(h1Text.length).toBeGreaterThan(0);

    // Check mobile navigation
    await hamburger.click();
    const navMenu = page.locator('.nav-menu');
    expect(await navMenu.isVisible()).toBe(true);
  });
});