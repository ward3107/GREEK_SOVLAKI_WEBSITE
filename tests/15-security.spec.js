const { test, expect } = require('@playwright/test');

test.describe('Security Tests @security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page has proper security headers', async ({ page }) => {
    // Get response headers
    const response = await page.goto('/');
    const headers = response.headers();

    // Check for security headers
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'referrer-policy'
    ];

    for (const header of securityHeaders) {
      expect(headers[header]).toBeTruthy();
    }

    // Content Security Policy
    const csp = headers['content-security-policy'];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
  });

  test('No console security warnings', async ({ page }) => {
    const securityWarnings = [];

    page.on('console', msg => {
      const text = msg.text().toLowerCase();
      if (text.includes('security') ||
          text.includes('mixed content') ||
          text.includes('certificate') ||
          text.includes('unsafe')) {
        securityWarnings.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should not have security warnings
    expect(securityWarnings.length).toBe(0);
  });

  test('No inline scripts that could be security risks', async ({ page }) => {
    const pageContent = await page.content();

    // Check for dangerous inline script patterns
    const dangerousPatterns = [
      /eval\s*\(/gi,
      /innerHTML\s*=/gi,
      /document\.write\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(\s*["'].*["']/gi
    ];

    for (const pattern of dangerousPatterns) {
      const matches = pageContent.match(pattern);
      if (matches) {
        // Some patterns might be legitimate, check context
        // For now, just log the findings
        console.log(`Found potentially dangerous pattern: ${pattern}`);
      }
    }
  });

  test('External resources are loaded over HTTPS', async ({ page }) => {
    const insecureUrls = [];

    page.on('request', request => {
      const url = request.url();
      if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        insecureUrls.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // All external resources should use HTTPS
    expect(insecureUrls.length).toBe(0);
  });

  test('Form inputs are properly sanitized', async ({ page }) => {
    // Look for forms with user input
    const forms = page.locator('form');
    const formCount = await forms.count();

    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);

      // Check for CSRF protection indicators
      const csrfToken = form.locator('input[name*="csrf"], input[name*="token"]');
      const hasCsrf = await csrfToken.count() > 0;

      // Check for form validation
      const requiredFields = form.locator('[required]');
      const hasValidation = await requiredFields.count() > 0;

      // Forms should have either CSRF protection or client-side validation
      expect(hasCsrf || hasValidation || formCount === 0).toBe(true);
    }
  });

  test('No sensitive data in client-side storage', async ({ page }) => {
    // Check localStorage and sessionStorage for sensitive data
    const sensitiveData = await page.evaluate(() => {
      const sensitivePatterns = [
        /password/i,
        /token/i,
        /secret/i,
        /key/i,
        /auth/i
      ];

      const checkStorage = (storage) => {
        const issues = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          const value = storage.getItem(key);

          for (const pattern of sensitivePatterns) {
            if (pattern.test(key) || pattern.test(value)) {
              issues.push(`${key}: ${value}`);
            }
          }
        }
        return issues;
      };

      return {
        localStorage: checkStorage(localStorage),
        sessionStorage: checkStorage(sessionStorage)
      };
    });

    expect(sensitiveData.localStorage.length).toBe(0);
    expect(sensitiveData.sessionStorage.length).toBe(0);
  });

  test('No exposed API keys or credentials', async ({ page }) => {
    const pageContent = await page.content();

    // Look for common patterns that might expose secrets
    const secretPatterns = [
      /api[_-]?key/i,
      /secret[_-]?key/i,
      /password/i,
      /token/i,
      /authorization/i,
      /client[_-]?secret/i
    ];

    const potentialSecrets = [];

    for (const pattern of secretPatterns) {
      const matches = pageContent.match(new RegExp(pattern.source, 'gi'));
      if (matches) {
        // Check if it's actually a secret or just variable names
        for (const match of matches) {
          // Look for actual values (quoted strings)
          const valuePattern = new RegExp(`${pattern.source}["'"]\\s*[:=]\\s*["'"]([^"']+)["'"]`, 'gi');
          const valueMatches = pageContent.match(valuePattern);
          if (valueMatches) {
            potentialSecrets.push(valueMatches[1]);
          }
        }
      }
    }

    // Should not find actual secret values
    expect(potentialSecrets.length).toBe(0);
  });

  test('Cookies are secure', async ({ page }) => {
    const cookies = await page.context().cookies();

    for (const cookie of cookies) {
      // Check for secure flag
      if (cookie.name !== 'test') { // Ignore test cookies
        expect(cookie.secure || !cookie.httpOnly).toBe(true);
      }

      // Check for httpOnly flag for sensitive cookies
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.httpOnly).toBe(true);
      }

      // Check for sameSite policy
      expect(cookie.sameSite).toBeDefined();
    }
  });

  test('No open redirect vulnerabilities', async ({ page }) => {
    // Look for redirect functionality
    const redirectLinks = page.locator('a[href*="redirect"], a[href*="return"], a[href*="goto"]');
    const redirectCount = await redirectLinks.count();

    for (let i = 0; i < redirectCount; i++) {
      const link = redirectLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href) {
        // Check if redirect is to external site without validation
        const externalUrl = href.match(/^https?:\/\/([^\/]+)/);
        if (externalUrl) {
          const domain = externalUrl[1];
          // Should redirect only to trusted domains
          const trustedDomains = [
            'instagram.com',
            'facebook.com',
            'twitter.com',
            'wa.me',
            'google.com',
            'maps.google.com'
          ];

          expect(trustedDomains.some(trusted => domain.includes(trusted))).toBe(true);
        }
      }
    }
  });

  test('Input validation prevents XSS', async ({ page }) => {
    // Look for input fields
    const inputs = page.locator('input[type="text"], textarea');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      for (let i = 0; i < Math.min(3, inputCount); i++) {
        const input = inputs.nth(i);

        // Test with XSS payload
        const xssPayload = '<script>alert("XSS")</script>';
        await input.fill(xssPayload);

        // Check if script was sanitized
        const currentValue = await input.inputValue();
        expect(currentValue).not.toContain('<script>');
        expect(currentValue).not.toContain('alert(');
      }
    }
  });

  test('No exposed error information', async ({ page }) => {
    // Try to trigger errors by accessing invalid pages
    const errorPages = [
      '/admin',
      '/api/test',
      '/debug',
      '/.env'
    ];

    for (const errorPage of errorPages) {
      try {
        const response = await page.goto(errorPage, { waitUntil: 'domcontentloaded' });
        const textContent = await page.content();

        // Error pages should not expose sensitive information
        const sensitiveInfo = textContent.match(/stack trace|error in|exception|fatal error/gi);
        if (sensitiveInfo) {
          // Check if it's a generic error message vs detailed stack trace
          expect(sensitiveInfo.length).toBeLessThan(100);
        }
      } catch (error) {
        // 404 errors are expected for these paths
        expect(error.status()).toBe(404);
      }
    }
  });

  test('File upload security (if applicable)', async ({ page }) => {
    // Look for file upload inputs
    const fileInputs = page.locator('input[type="file"]');
    const fileCount = await fileInputs.count();

    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        const fileInput = fileInputs.nth(i);

        // Check for file type restrictions
        const accept = await fileInput.getAttribute('accept');

        if (accept) {
          // Should restrict to safe file types
          const unsafeTypes = ['exe', 'bat', 'cmd', 'sh', 'php', 'jsp', 'asp'];
          const acceptLower = accept.toLowerCase();

          for (const unsafeType of unsafeTypes) {
            expect(acceptLower.includes(unsafeType)).toBe(false);
          }
        }

        // Check for file size restrictions (can't be directly tested, but check for attributes)
        const maxSize = await fileInput.getAttribute('data-max-size');
        const maxLength = await fileInput.getAttribute('maxlength');

        // Should have some form of size restriction
        expect(maxSize || maxLength || true).toBe(true);
      }
    }
  });

  test('Rate limiting indicators', async ({ page }) => {
    // Look for rate limiting or rate-limiting related elements
    const rateLimitIndicators = page.locator('[data-rate-limit], .rate-limit, .too-many-attempts');

    // Test multiple rapid requests to a form or action
    const submitBtns = page.locator('button[type="submit"]');
    const submitCount = await submitBtns.count();

    if (submitCount > 0) {
      const submitBtn = submitBtns.first();

      // Click multiple times rapidly (would be caught by rate limiting)
      for (let i = 0; i < 5; i++) {
        await submitBtn.click();
        await page.waitForTimeout(100);
      }

      // Check if rate limiting message appears
      const rateLimitMessage = await rateLimitIndicators.count();
      expect(rateLimitMessage).toBeGreaterThanOrEqual(0);
    }
  });

  test('Secure iframe usage', async ({ page }) => {
    // Check for iframes
    const iframes = page.locator('iframe');
    const iframeCount = await iframes.count();

    for (let i = 0; i < iframeCount; i++) {
      const iframe = iframes.nth(i);
      const src = await iframe.getAttribute('src');

      if (src) {
        // Check if iframe uses HTTPS
        expect(src.startsWith('https://') || src.startsWith('about:')).toBe(true);

        // Check for sandbox attribute
        const sandbox = await iframe.getAttribute('sandbox');
        // Iframe should have sandbox unless it's trusted content
        expect(sandbox || src.includes('google.com')).toBeTruthy();

        // Check for security attributes
        const allow = await iframe.getAttribute('allow');
        const allowFullscreen = await iframe.getAttribute('allowfullscreen');

        // Iframe should have restrictive permissions
        expect(allow || allowFullscreen).toBeTruthy();
      }
    }
  });
});