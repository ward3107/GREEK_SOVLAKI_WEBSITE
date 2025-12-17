const { test, expect } = require('@playwright/test');

test.describe('Performance Tests @performance', () => {
  test('Page loads within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds on decent connection
    expect(loadTime).toBeLessThan(3000);

    // Check if critical elements are loaded
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Core Web Vitals are within acceptable ranges', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const vitalsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};

            entries.forEach(entry => {
              if (entry.name === 'largest-contentful-paint') {
                vitals.lcp = entry.startTime;
              } else if (entry.name === 'first-input-delay') {
                vitals.fid = entry.processingStart - entry.startTime;
              } else if (entry.name === 'cumulative-layout-shift') {
                vitals.cls = entry.value;
              }
            });

            resolve(vitals);
          });

          vitalsObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          vitalsObserver.observe({ type: 'first-input-delay', buffered: true });
          vitalsObserver.observe({ type: 'layout-shift', buffered: true });

          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        } else {
          resolve({});
        }
      });
    });

    // Check Largest Contentful Paint (LCP) - should be under 2.5s
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500);
    }

    // Check First Input Delay (FID) - should be under 100ms
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100);
    }

    // Check Cumulative Layout Shift (CLS) - should be under 0.1
    if (metrics.cls) {
      expect(metrics.cls).toBeLessThan(0.1);
    }
  });

  test('Images are optimized and load efficiently', async ({ page }) => {
    await page.goto('/');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Get all image elements
    const images = await page.locator('img').all();

    for (const img of images) {
      if (await img.isVisible()) {
        // Check if image has src attribute
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src.length).toBeGreaterThan(0);

        // Check if image has alt attribute for accessibility
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();

        // Check image dimensions are set (for performance)
        const width = await img.getAttribute('width');
        const height = await img.getAttribute('height');

        // Images should have dimensions specified to prevent layout shift
        expect(width || height).toBeTruthy();

        // Check if image format is optimized (prefer WebP)
        if (src) {
          const isWebP = src.includes('.webp');
          // If not WebP, should be at least optimized
          if (!isWebP) {
            // Could add more checks here for image optimization
          }
        }
      }
    }
  });

  test('CSS and JavaScript are properly minified in production', async ({ page }) => {
    await page.goto('/');

    // Get CSS files
    const cssLinks = await page.locator('link[rel="stylesheet"]').all();

    for (const link of cssLinks) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('fonts.googleapis.com')) {
        // Check if CSS is minified (contains minified version)
        const response = await page.evaluate(async (cssHref) => {
          try {
            const res = await fetch(cssHref);
            const text = await res.text();
            return {
              size: text.length,
              isMinified: text.includes('}') && text.length > 1000 && !text.includes('\n  ')
            };
          } catch {
            return { size: 0, isMinified: false };
          }
        }, href);

        // Large CSS files should be minified
        if (response.size > 5000) {
          expect(response.isMinified).toBe(true);
        }
      }
    }

    // Get JavaScript files
    const jsScripts = await page.locator('script[src]').all();

    for (const script of jsScripts) {
      const src = await script.getAttribute('src');
      if (src && !src.includes('google') && !src.includes('analytics')) {
        const response = await page.evaluate(async (jsSrc) => {
          try {
            const res = await fetch(jsSrc);
            const text = await res.text();
            return {
              size: text.length,
              isMinified: text.includes(';') && text.length > 1000 && !text.includes('\n  ')
            };
          } catch {
            return { size: 0, isMinified: false };
          }
        }, src);

        // Large JS files should be minified
        if (response.size > 5000) {
          expect(response.isMinified).toBe(true);
        }
      }
    }
  });

  test('Resource loading is efficient', async ({ page }) => {
    const responses = [];

    page.on('response', response => {
      if (response.url().startsWith('http')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for proper caching headers
    const staticResources = responses.filter(r =>
      r.url.includes('.css') ||
      r.url.includes('.js') ||
      r.url.includes('.webp') ||
      r.url.includes('.jpg') ||
      r.url.includes('.png')
    );

    for (const resource of staticResources) {
      expect(resource.status).toBe(200);

      // Check for caching headers
      const cacheControl = resource.headers['cache-control'];
      const etag = resource.headers['etag'];

      // Static resources should have caching or ETag
      expect(cacheControl || etag).toBeTruthy();
    }
  });

  test('Page has proper preload hints', async ({ page }) => {
    await page.goto('/');

    // Check for preload links
    const preloads = await page.locator('link[rel="preload"]').all();

    // Should have preload for critical resources
    expect(preloads.length).toBeGreaterThan(0);

    for (const preload of preloads) {
      const as = await preload.getAttribute('as');
      const href = await preload.getAttribute('href');

      expect(as).toBeTruthy();
      expect(href).toBeTruthy();

      // Check if preloaded resource actually exists
      if (as === 'style' && href) {
        // Verify CSS preload
        const linkExists = await page.locator(`link[href="${href}"]`).count();
        expect(linkExists).toBeGreaterThan(0);
      }
    }
  });

  test('Lazy loading works for images', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Find images with loading="lazy"
    const lazyImages = await page.locator('img[loading="lazy"]').all();

    if (lazyImages.length > 0) {
      // Check lazy images are not loaded initially if outside viewport
      for (const img of lazyImages) {
        const isVisible = await img.isVisible();
        if (!isVisible) {
          // Image outside viewport should not be loaded yet
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          expect(naturalWidth).toBe(0);
        }
      }

      // Scroll down to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Now images should be loaded
      for (const img of lazyImages.slice(0, 3)) {
        await expect(img).toBeVisible();
      }
    }
  });

  test('Service Worker is registered and functional', async ({ page }) => {
    await page.goto('/');

    // Check if service worker is registered
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });

    if (swRegistration) {
      expect(swRegistration.active).toBeTruthy();
    }

    // Test PWA manifest
    const manifest = await page.locator('link[rel="manifest"]').first();
    if (await manifest.count() > 0) {
      const manifestHref = await manifest.getAttribute('href');
      expect(manifestHref).toBeTruthy();
    }
  });

  test('No console errors or warnings', async ({ page }) => {
    const consoleErrors = [];
    const consoleWarnings = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for console errors
    expect(consoleErrors).toEqual([]);

    // Allow some warnings but check for critical ones
    const criticalWarnings = consoleWarnings.filter(warning =>
      warning.includes('error') ||
      warning.includes('failed') ||
      warning.includes('404')
    );

    expect(criticalWarnings).toEqual([]);
  });

  test('Third-party scripts load efficiently', async ({ page }) => {
    const thirdPartyLoads = [];

    page.on('request', request => {
      if (request.url().includes('google') ||
          request.url().includes('analytics') ||
          request.url().includes('fonts.googleapis.com')) {
        thirdPartyLoads.push(request.url());
      }
    });

    await page.goto('/');

    // Third-party resources should load without errors
    await page.waitForLoadState('networkidle');

    // Check if fonts are loaded successfully
    const fontFamily = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );

    expect(fontFamily).toBeTruthy();
    expect(fontFamily.length).toBeGreaterThan(0);
  });

  test('Page size is reasonable', async ({ page }) => {
    await page.goto('/');

    // Get total transferred data
    const transferSize = await page.evaluate(() => {
      if (performance && performance.getEntriesByType) {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          return entries[0].transferSize;
        }
      }
      return 0;
    });

    // Page should be reasonably sized (under 2MB initial load)
    // This is a rough estimate - adjust based on your requirements
    const reasonableSize = 2 * 1024 * 1024; // 2MB
    expect(transferSize).toBeLessThan(reasonableSize);
  });
});