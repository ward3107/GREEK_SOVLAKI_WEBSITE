# Test Coverage Documentation

## Overview
This document outlines the comprehensive test suite for the Greek Souvlaki Restaurant Website, covering all aspects of functionality, accessibility, performance, and user experience.

## Test Categories

### 1. Smoke Tests (@smoke)
- **Purpose**: Quick validation of core functionality
- **Files**:
  - `01-homepage.spec.js` (updated)
  - `04-language-switcher.spec.js` (updated)
- **Coverage**: Basic page loading, navigation, critical elements
- **Runtime**: Fast (1-2 minutes)

### 2. Critical Path Tests (@critical)
- **Purpose**: Essential user flows and core business functions
- **Files**:
  - `01-homepage.spec.js` (updated)
  - `04-language-switcher.spec.js` (updated)
  - `10-multilingual.spec.js` (key paths)
  - `14-user-workflows.spec.js` (critical workflows)
- **Coverage**: Must-pass functionality for the restaurant website
- **Runtime**: Medium (3-5 minutes)

### 3. Multilingual Tests (@i18n)
- **File**: `10-multilingual.spec.js`
- **Coverage**:
  - Language switching functionality
  - Translation loading
  - RTL/LTR direction handling
  - Language persistence
  - Fallback mechanisms
- **Languages Tested**: Hebrew, English, Arabic, Russian, Greek

### 4. Responsive Design Tests (@responsive)
- **File**: `11-responsive-design.spec.js`
- **Coverage**:
  - Multiple viewport sizes (320px to 1920px width)
  - Mobile navigation
  - Touch target accessibility
  - Horizontal scrolling prevention
  - Media query functionality

### 5. Performance Tests (@performance)
- **File**: `12-performance.spec.js`
- **Coverage**:
  - Core Web Vitals (LCP, FID, CLS)
  - Page load times
  - Image optimization
  - Resource loading efficiency
  - Caching headers
  - Bundle sizes

### 6. Accessibility Tests (@accessibility)
- **File**: `13-accessibility.spec.js`
- **Coverage**:
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast
  - ARIA landmarks
  - Form accessibility

### 7. PWA Tests (@pwa)
- **File**: `08-pwa.spec.js`
- **Coverage**:
  - Service worker registration
  - Manifest validation
  - Offline functionality
  - App-like behavior
  - Theme switching

### 8. Animation Tests (@animations)
- **File**: `06-animations.spec.js`
- **Coverage**:
  - Animation performance
  - WOW.js animations
  - CSS animations
  - Animation triggers
  - Performance impact

### 9. User Workflow Tests (@workflows)
- **File**: `14-user-workflows.spec.js`
- **Coverage**:
  - Complete user journeys
  - Multi-step processes
  - Mobile user experience
  - Feature integration
  - Cross-page navigation

### 10. Security Tests (@security)
- **File**: `15-security.spec.js`
- **Coverage**:
  - Security headers
  - XSS prevention
  - CSRF protection
  - Input validation
  - HTTPS enforcement
  - Data privacy

### 11. Content Validation Tests (@content)
- **File**: `16-content-validation.spec.js`
-Coverage**:
  - Business information accuracy
  - Menu content
  - Contact information
  - SEO elements
  - Mobile content adaptation
  - Legal pages

### 12. Component-Specific Tests
- **Files**:
  - `02-scroll-button.spec.js` - Scroll to top functionality
  - `03-accessibility-widget.spec.js` - Accessibility widget
  - `05-navigation.spec.js` - Navigation menu
  - `07-theme-toggle.spec.js` - Theme switching

### 13. Visual Regression Tests
- **File**: `09-visual-regression.spec.js`
- **Coverage**: Visual consistency across browsers

## Test Tags Usage

### Running Tests by Category

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run critical functionality tests
npm run test:critical

# Run specific category tests
npm run test:accessibility
npm run test:performance
npm run test:responsive
npm run test:i18n
npm run test:mobile
npm run test:workflows
npm run test:security
npm run test:content

# Run comprehensive test suite
npm run test:run-all
```

### Running Tests by Browser

```bash
# Run in all browsers
npm run test:full

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Development and Debugging

```bash
# Run with visual interface
npm run test:ui

# Run headed (with browser window)
npm run test:headed

# Run with debugging
npm run test:debug

# Generate HTML report
npm run test:report
```

## Test Environment Configuration

### Browser Support
- **Chromium**: Latest version
- **Firefox**: Latest version
- **WebKit**: Latest version (Safari)

### Viewport Sizes
- **Desktop**: 1920x1080
- **Laptop**: 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667 (iPhone 13)
- **Small Mobile**: 320x568

### Test Data
- **Contact Information**: Test email: test@example.com, Test phone: 1234567890
- **Form Data**: Automated test data with realistic values
- **User Agents**: Default Playwright user agents

## CI/CD Integration

### GitHub Actions (test:ci)
```yaml
- name: Run tests
  run: npm run test:ci
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: test-results/
```

### Report Generation
- **HTML Report**: Interactive test results
- **JSON Report**: Machine-readable test results
- **Screenshots**: On failure for debugging
- **Videos**: On failure for visual debugging

## Performance Benchmarks

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Page Load Targets
- **Initial Page Load**: < 3s
- **Navigation Load**: < 1s
- **Image Load**: Optimized and progressive
- **Total Bundle Size**: < 2MB initial load

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Level A**: Must pass for all content
- **Level AA**: Must pass for all interactive elements
- **Contrast Ratios**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard access
- **Screen Reader**: Compatible with major screen readers

## Test Data Management

### Contact Form Testing
- **Email**: `test@example.com`
- **Phone**: `04-812-2980` (masked for privacy)
- **Name**: `Test User`
- **Message**: `This is a test message for form validation`

### Navigation Testing
- **Internal Links**: All section anchors
- **External Links**: Social media with `target="_blank"`
- **Language Links**: Proper hreflang attributes
- **Back to Top**: Smooth scroll functionality

## Continuous Improvement

### Test Maintenance
- **Regular Updates**: Tests updated with new features
- **Coverage Reports**: Monitored and improved
- **Performance Baselines**: Updated as needed
- **Accessibility Standards**: Reviewed for compliance

### Test Metrics
- **Pass Rate**: Target 95%+ for critical tests
- **Execution Time**: Under 5 minutes for full suite
- **Coverage**: Maintain or improve test coverage
- **Reliability**: Reduce flaky tests through better waits

## Test Automation Best Practices

### Page Object Model
- **Reusable Elements**: Common page interactions
- **Maintenance**: Centralized element locators
- **Readability**: Clear test descriptions and expectations

### Test Organization
- **Descriptive Names**: Clear test and describe blocks
- **Logical Grouping**: Related tests grouped together
- **Tags**: Proper test tagging for filtering
- **Documentation**: Clear test purpose and coverage

### Error Handling
- **Timeouts**: Appropriate wait times for elements
- **Retries**: Configurable retries for flaky tests
- **Cleanup**: Proper test isolation and cleanup
- **Debugging**: Screenshots and videos on failure

## Test Results and Reporting

### Success Criteria
- All critical tests pass
- 95%+ overall test pass rate
- Core Web Vitals within acceptable ranges
- No security vulnerabilities
- Full accessibility compliance

### Failure Analysis
- **Screenshots**: Captured on test failure
- **Videos**: Recorded for visual debugging
- **Console Logs**: Captured for error analysis
- **Network Logs**: Request/response information

### Reporting Dashboards
- **HTML Reports**: Interactive test result viewer
- **Trends**: Test performance over time
- **Coverage**: Test coverage metrics
- **Integration**: CI/CD pipeline integration

---

## Quick Reference

### Common Test Commands
```bash
npm test                                    # Run all tests
npm run test:smoke                      # Quick smoke tests
npm run test:critical                    # Critical functionality
npm run test:accessibility               # Accessibility compliance
npm run test:performance                # Performance benchmarks
npm run test:mobile                      # Mobile device tests
npm run test:run-all                      # Comprehensive suite
```

### Test Categories Summary
- **Smoke Tests**: 2 files - Basic functionality
- **Critical Tests**: 5 files - Core business logic
- **Feature Tests**: 8 files - Specific functionality
- **Integration Tests**: 2 files - Cross-feature testing
- **Visual Tests**: 1 file - UI consistency
- **Total**: 16 test files covering all aspects

This comprehensive test suite ensures the Greek Souvlaki website maintains high quality, accessibility, performance, and reliability across all supported platforms and devices.