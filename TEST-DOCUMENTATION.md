# Greek Souvlaki Website - Test Documentation

## Overview
Comprehensive test suite for the Greek Souvlaki restaurant website using Playwright for end-to-end testing.

## Test Coverage

### 1. Homepage Tests (`01-homepage.spec.js`)
- ✅ Homepage loads successfully
- ✅ Hero section displays correctly
- ✅ Greek flag is visible
- ✅ RTL direction for Hebrew
- ✅ All main sections are present
- ✅ Navigation menu works
- ✅ Restaurant logo displays
- ✅ Meta description exists
- ✅ No console errors

### 2. Scroll Button Tests (`02-scroll-button.spec.js`)
- ✅ Scroll button is visible
- ✅ Button positioned on right side
- ✅ Scrolls to top when clicked
- ✅ Has arrow icon
- ✅ Proper ARIA labels
- ✅ Styled correctly (circular, blue)
- ✅ Always visible
- ✅ Hover effects work

### 3. Accessibility Widget Tests (`03-accessibility-widget.spec.js`)
- ✅ Widget button is visible
- ✅ Positioned on left side
- ✅ Panel opens when clicked
- ✅ Panel closes with close button
- ✅ Font size increase/decrease
- ✅ High contrast mode
- ✅ Settings reset functionality
- ✅ LocalStorage persistence

### 4. Language Switcher Tests (`04-language-switcher.spec.js`)
- ✅ Language dropdown displays
- ✅ Shows current language
- ✅ Opens language menu
- ✅ All language options visible
- ✅ Switch to English (LTR)
- ✅ Switch to Arabic (RTL)
- ✅ Switch to Russian (LTR)
- ✅ Active language highlighted
- ✅ Language persists on reload

### 5. Navigation Tests (`05-navigation.spec.js`)
- ✅ Navigate to menu section
- ✅ Navigate to about section
- ✅ Navigate to gallery section
- ✅ Navigate to contact section
- ✅ View Menu button scrolls to menu
- ✅ Smooth scrolling enabled
- ✅ Mobile hamburger menu works
- ✅ All navigation links present

### 6. Animation Tests (`06-animations.spec.js`)
- ✅ Fade-in animations exist
- ✅ Elements reveal on scroll
- ✅ Greek flag float animation
- ✅ Greek flag glow effect
- ✅ Particles created in hero
- ✅ Menu hover effects
- ✅ CTA button pulse animation
- ✅ Features scale-in animation
- ✅ Stagger effects work
- ✅ Glassmorphism on about section
- ✅ Gallery zoom-hover effect
- ✅ Parallax layers present
- ✅ Greek pattern background
- ✅ No layout shift from animations

### 7. Theme Toggle Tests (`07-theme-toggle.spec.js`)
- ✅ Theme toggle button visible
- ✅ Has ARIA label
- ✅ Sun icon shows initially
- ✅ Toggles between modes
- ✅ Icon switches on toggle
- ✅ Theme persists on reload

### 8. PWA Tests (`08-pwa.spec.js`)
- ✅ Manifest file exists
- ✅ Manifest is accessible
- ✅ Apple mobile meta tags
- ✅ Apple touch icon
- ✅ Theme color meta tag
- ✅ Service worker registers
- ✅ Files cached correctly
- ✅ Works offline
- ✅ Viewport meta tag
- ✅ Manifest has required fields
- ✅ Icon sizes correct

### 9. Visual Regression Tests (`09-visual-regression.spec.js`)
- ✅ Homepage snapshot
- ✅ Hero section snapshot
- ✅ Menu section snapshot
- ✅ About section snapshot
- ✅ Gallery section snapshot
- ✅ Contact section snapshot
- ✅ Footer snapshot
- ✅ Navigation bar snapshot
- ✅ Mobile view snapshot
- ✅ Tablet view snapshot
- ✅ English language snapshot
- ✅ Accessibility widget snapshot
- ✅ Language dropdown snapshot

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Specific Test Categories
```bash
# Accessibility tests only
npm run test:accessibility

# Animation tests only
npm run test:animations

# PWA tests only
npm run test:pwa

# Mobile tests only
npm run test:mobile
```

### Run Tests on All Browsers
```bash
npm run test:all
```

### View Test Report
```bash
npm run test:report
```

## Test Results

Test results are saved in:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **Screenshots**: `test-results/` (on failure)
- **Videos**: `test-results/` (on failure)
- **Traces**: Available in test report

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Writing New Tests

### Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test code here
    await expect(page.locator('.element')).toBeVisible();
  });
});
```

### Best Practices
1. **Use descriptive test names** - Explain what the test does
2. **Group related tests** - Use `test.describe()` blocks
3. **Wait for elements** - Use `waitForTimeout()` or `waitForLoadState()`
4. **Use selectors wisely** - Prefer data-testid, ARIA labels, or semantic selectors
5. **Test user flows** - Simulate real user interactions
6. **Keep tests independent** - Each test should work standalone
7. **Clean up** - Reset state in beforeEach/afterEach hooks

## Debugging Failed Tests

### View Screenshots
Failed tests automatically capture screenshots in `test-results/`

### View Videos
Failed tests record videos in `test-results/`

### View Traces
```bash
npx playwright show-trace test-results/trace.zip
```

### Debug Specific Test
```bash
npx playwright test --debug tests/01-homepage.spec.js
```

## Test Coverage Metrics

Total Tests: **100+**

Coverage by Feature:
- Homepage: 9 tests
- Scroll Button: 8 tests
- Accessibility Widget: 8 tests
- Language Switcher: 8 tests
- Navigation: 9 tests
- Animations: 14 tests
- Theme Toggle: 6 tests
- PWA: 10 tests
- Visual Regression: 13 tests

## Performance Benchmarks

- **Average Test Runtime**: ~30 seconds per test
- **Full Suite Runtime**: ~15 minutes (all browsers)
- **Single Browser**: ~5 minutes

## Browser Support

Tests run on:
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit (Safari)
- ✅ Mobile (iPhone 13)
- ✅ Tablet (iPad Pro)

## Accessibility Testing

Tests include:
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (via accessibility widget)
- Focus management
- Semantic HTML

## Continuous Monitoring

Consider setting up:
- **Scheduled test runs** - Run tests nightly
- **Performance monitoring** - Track test execution time
- **Flaky test detection** - Identify unstable tests
- **Coverage reports** - Track test coverage over time

## Troubleshooting

### Tests Fail Locally
1. Ensure local server is running on port 8000
2. Clear browser cache
3. Update Playwright: `npm install @playwright/test@latest`
4. Reinstall browsers: `npx playwright install`

### Timeout Errors
1. Increase timeout in test: `test.setTimeout(60000)`
2. Check network speed
3. Ensure elements load before interacting

### Visual Regression Fails
1. Update snapshots: `npx playwright test --update-snapshots`
2. Review changes carefully
3. Commit new snapshots if intentional

## Maintenance

- **Update snapshots** when UI changes
- **Review and update tests** when features change
- **Add new tests** for new features
- **Remove obsolete tests** for removed features
- **Keep dependencies updated** monthly

## Contact

For test issues or questions, contact the development team.

## License

Same as main project license.
