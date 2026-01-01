# Testing Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Node.js
Make sure you have Node.js installed (v16 or higher):
```bash
node --version
```

### 2. Install Dependencies
```bash
cd "C:\Users\User\Documents\GREEK SOVLAKI WEBSITE-APP\GREEK_SOVLAKI_WEBSITE"
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

## ▶️ Run Tests

### Run All Tests (Recommended First Time)
```bash
npm test
```

### Run Tests with Visual Interface
```bash
npm run test:ui
```

This opens an interactive UI where you can:
- See all tests
- Run specific tests
- Watch tests execute
- Debug failures

### Run Tests and See Them in Browser
```bash
npm run test:headed
```

## 📊 View Results

After tests complete:
```bash
npm run test:report
```

This opens an HTML report in your browser with:
- Test results
- Screenshots of failures
- Videos of test runs
- Execution traces

## 🎯 Common Commands

### Test Specific Features
```bash
# Test only accessibility
npm run test:accessibility

# Test only animations
npm run test:animations

# Test PWA features
npm run test:pwa

# Test on mobile devices
npm run test:mobile
```

### Test Specific File
```bash
npx playwright test tests/01-homepage.spec.js
```

### Debug a Test
```bash
npm run test:debug
```

## 📁 Test Files

All tests are in the `tests/` folder:
- `01-homepage.spec.js` - Homepage functionality
- `02-scroll-button.spec.js` - Scroll-up button
- `03-accessibility-widget.spec.js` - Accessibility features
- `04-language-switcher.spec.js` - Language switching
- `05-navigation.spec.js` - Menu navigation
- `06-animations.spec.js` - WOW animations
- `07-theme-toggle.spec.js` - Dark/Light theme
- `08-pwa.spec.js` - PWA functionality
- `09-visual-regression.spec.js` - Visual snapshots

## ✅ What Tests Check

### Functionality
- ✓ All buttons work
- ✓ Navigation scrolls correctly
- ✓ Language switching works
- ✓ Accessibility features function
- ✓ Theme toggle works
- ✓ Mobile responsive

### Animations
- ✓ Fade-in effects
- ✓ Parallax scrolling
- ✓ Hover effects
- ✓ Particle animations
- ✓ No layout shifts

### PWA Features
- ✓ Manifest file exists
- ✓ Service worker registers
- ✓ Works offline
- ✓ Can be installed

### Accessibility
- ✓ ARIA labels
- ✓ Keyboard navigation
- ✓ Color contrast options
- ✓ Font size adjustment

### Visual Regression
- ✓ UI looks correct
- ✓ No unexpected changes
- ✓ Responsive on all devices

## 🐛 If Tests Fail

1. **Make sure server is running**:
   - Tests need `http://localhost:8000` to be available
   - Playwright starts the server automatically

2. **Clear cache**:
   ```bash
   rm -rf test-results
   ```

3. **Update snapshots** (if UI changed intentionally):
   ```bash
   npx playwright test --update-snapshots
   ```

4. **Check specific failure**:
   - Look in `test-results/` for screenshots
   - Open HTML report: `npm run test:report`

## 📸 Screenshots & Videos

Failed tests automatically save:
- **Screenshots**: `test-results/*.png`
- **Videos**: `test-results/*.webm`
- **Traces**: View in report

## 🔄 Update Tests

When you change the website:
1. Run tests to see what breaks
2. Update tests if behavior changed
3. Update snapshots if UI changed
4. Commit updated tests

## 💡 Pro Tips

1. **Use UI mode for development**:
   ```bash
   npm run test:ui
   ```

2. **Run only failed tests**:
   ```bash
   npx playwright test --last-failed
   ```

3. **Run tests in parallel** (faster):
   Tests run in parallel by default!

4. **Debug specific test**:
   ```bash
   npx playwright test tests/02-scroll-button.spec.js --debug
   ```

5. **Generate code** (record interactions):
   ```bash
   npx playwright codegen http://localhost:8000
   ```

## 📝 Test Coverage

- **100+ tests** covering all features
- **5 browsers/devices** tested
- **Visual regression** included
- **Accessibility** validated
- **PWA features** verified

## ⏱️ Expected Duration

- Full test suite: ~5-15 minutes
- Single browser: ~5 minutes
- Single test file: ~30 seconds

## 🎓 Learn More

- Full documentation: `TEST-DOCUMENTATION.md`
- Playwright docs: https://playwright.dev
- Report issues to development team

## ✨ Happy Testing!

Run `npm test` and watch your website get thoroughly tested! 🚀
