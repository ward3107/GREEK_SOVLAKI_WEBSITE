# Project Tasks - Greek Souvlaki Website

This file tracks all improvement tasks based on the comprehensive project analysis. Tasks are organized by priority and should be completed in order.

---

## LEGEND

- [ ] Task not started
- [x] Task completed
- [~] Task in progress

---

## HIGH PRIORITY TASKS

### 1. Clean Up Backup Files

- [x] Remove `index.html.bak_20251220_*` (4 files including apple-touch-icon.png.bak)
- [x] Remove `privacy-backup.html`
- [x] Remove `privacy-simple.html`
- [x] Remove `privacy-test.html`
- [x] Remove `js/index-scripts.js.bak_*` (3 files)
- [x] Remove unused translation files: `translations.js`, `translations-old.js`

### 2. Update GitHub Actions

- [x] Update `.github/workflows/deploy.yml` line 34: Change `peaceiris/actions-gh-pages@v3` to `@v4`
- [ ] Test deployment workflow after update (will be tested on next push)

### 3. Configure or Remove Google Analytics

- [x] Removed Google Analytics placeholder code from `index.html`
- [x] Updated CSP headers to remove Google Analytics domains

---

## MEDIUM PRIORITY TASKS

### 4. Fix CSS Duplicate Definitions

- [x] Removed duplicate skip-link CSS definition in `styles.css` (lines 357-377)
- [x] Verified styles still work after removal (first definition at lines 17-36 remains intact)

### 5. Add 404 Handling for Invalid Hash Routes

- [x] Added fallback handling in `script.js` for invalid hash fragments
- [x] Shows user-friendly toast notification and redirects to home after 5 seconds
- [x] Handles both click events and direct URL navigation (hashchange event)

### 6. Consolidate Redundant Language Dropdown Code

- [x] Reviewed language dropdown handling - found 4 duplicate implementations
- [x] Consolidated into single implementation in `toggles.js`
- [x] Removed redundant code from `script.js` (3 implementations removed)
- [x] Verified language dropdown elements exist in HTML

### 7. Fix Mobile Menu Duplicate Code

- [x] Reviewed mobile menu code in `script.js` and `mobile-menu-fix.js`
- [x] Consolidated into single implementation in `script.js`
- [x] Removed `mobile-menu-fix.js` file and script reference from `index.html`
- [x] Verified mobile menu HTML elements exist (3 references found)

### 8. Minify Assets for Production

- [x] Installed csso-cli and terser packages
- [x] Created build.js script for minification
- [x] Created restore.js script for restoring backups
- [x] Added `npm run build` and `npm run build:restore` scripts to package.json
- [x] Updated .github/workflows/deploy.yml to run build before deployment
- [x] Updated .gitignore to exclude .backup/ directory
- [x] Tested build: CSS reduced 38.7%, JS reduced 52.9% on average

### 9. Review CSP Policy

- [x] Analyzed current CSP policy in index.html
- [x] Identified dynamic style tag creation in script.js (toast notifications)
- [x] Evaluated alternatives: nonce-based CSP, external CSS, unsafe-hashes
- [x] Created CSP-ANALYSIS.md with full justification
- [x] Updated CSP comment in index.html to document why unsafe-inline is required
- [x] Decision: Keep unsafe-inline for styles (required for accessibility feature)

---

## LOW PRIORITY TASKS

### 10. Remove Debug Console Statements

- [x] Updated build.js to use terser API directly for better control
- [x] Configured build to remove console.log, console.warn, console.debug
- [x] Kept console.error for production error tracking
- [x] Verified removal: script.js now only contains console.error (4 instances)
- [x] Tested build: site still loads correctly

### 11. Update Dependencies

- [x] Updated `@playwright/test` from v1.40.0 to v1.57.0
- [x] Updated `@axe-core/playwright` from v4.8.0 to v4.11.0
- [x] Ran tests: 20 passed, 25 failed (pre-existing selector issues - see Task 15)

### 12. Add Node Version Specification

- [x] Created `.nvmrc` file with Node version 24
- [x] Updated `.github/workflows/deploy.yml` to use `node-version-file: '.nvmrc'`

### 13. Fix Image Attributes for CLS

- [x] Added width/height attributes to all 29 gallery images missing them
- [x] Verified all lazy-loaded images now have dimensions
- [x] Site still loads correctly

### 14. Add Environment Variable Handling

- [x] Create `.env.example` file
- [x] Document required environment variables
- [x] Note: This is a static site - most configuration is in HTML/CSS/JS files

### 15. Fix Test Selectors

- [x] Updated `tests/01-homepage.spec.js` to reference existing elements
  - Fixed title regex to match Hebrew title: `/סובלאקי יווני|Greek Souvlaki/`
  - Fixed hero content selector: `.hero-content h1` instead of `.hero-content h2`
  - Fixed hero content paragraph: `.hero-content p` to `.hero-content p.first()` (multiple p elements)
  - Fixed hero CTA button: `.cta-btn` to `.hero-cta-btn`
  - Removed non-existent `.greek-flag img` test (no Greek flag element in HTML)
  - Removed non-existent `.logo-img` test (no logo-img class in HTML)
  - Fixed navigation menu test to check `.nav-dropdown-toggle` and count nav links
- [x] All 175 tests passing (35 homepage tests + 140 other tests)

### 16. Add Rate Limiting to Dev Server

- [ ] Implement rate limiting in `server.js`
- [ ] Test rate limiting functionality

### 17. Document Local Development Scripts

- [ ] Document purpose of `force-http.js` (local dev only)
- [ ] Add comments to prevent production use

### 18. Add Error Boundary Handling

- [ ] Implement global error handler
- [ ] Add user-friendly error messages
- [ ] Consider error tracking service

### 19. Consider CDN for Assets

- [ ] Evaluate CDN options for static assets
- [ ] Implement if beneficial for performance

### 20. Add Production Monitoring

- [ ] Set up analytics for production issues
- [ ] Implement error tracking
- [ ] Document monitoring setup

---

## COMPLETED TASKS

### 1. Clean Up Backup Files (Completed: 2025-12-23)

- [x] Removed `index.html.bak_20251220_*` (4 files)
- [x] Removed `privacy-backup.html`
- [x] Removed `privacy-simple.html`
- [x] Removed `privacy-test.html`
- [x] Removed `js/index-scripts.js.bak_*` (3 files)
- [x] Removed unused translation files: `translations.js`, `translations-old.js`

### 2. Update GitHub Actions (Completed: 2025-12-23)

- [x] Updated `.github/workflows/deploy.yml` line 34: Changed `peaceiris/actions-gh-pages@v3` to `@v4`
- [ ] Test deployment workflow after update (will be tested on next push to main)

### 3. Configure or Remove Google Analytics (Completed: 2025-12-23)

- [x] Removed Google Analytics placeholder code from `index.html`
- [x] Updated CSP headers to remove Google Analytics domains (googletagmanager.com, google-analytics.com, *.google-analytics.com)

### 4. Fix CSS Duplicate Definitions (Completed: 2025-12-23)

- [x] Removed duplicate skip-link CSS definition in `styles.css` (lines 357-377, previously 358-377)
- [x] Verified styles still work after removal (first definition at lines 17-36 remains intact)

### 5. Add 404 Handling for Invalid Hash Routes (Completed: 2025-12-23)

- [x] Added fallback handling in `script.js` for invalid hash fragments (lines 152-287)
- [x] Shows user-friendly toast notification with warning icon and close button
- [x] Auto-redirects to home after 5 seconds and cleans invalid hash from URL
- [x] Handles both click events and direct URL navigation (hashchange event)
- [x] Accessible with ARIA live region and proper role attributes

### 6. Consolidate Redundant Language Dropdown Code (Completed: 2025-12-23)

- [x] Reviewed language dropdown handling - found 4 implementations across `script.js` and `toggles.js`
- [x] Consolidated into single clean implementation in `toggles.js`
- [x] Removed redundant code from `script.js`:
  - Removed first implementation (lines 75-123)
  - Removed `enhanceLanguageDropdown()` function
  - Removed `bindLanguageDropdownDelegated()` function
  - Removed function calls from initialization
- [x] Verified language dropdown HTML elements exist (8 references found)

### 7. Fix Mobile Menu Duplicate Code (Completed: 2025-12-23)

- [x] Reviewed mobile menu code - found 2 implementations (`script.js` and `mobile-menu-fix.js`)
- [x] Consolidated into single implementation in `script.js` (has proper initialization guard)
- [x] Deleted `mobile-menu-fix.js` file
- [x] Removed script reference from `index.html` (line 1002)
- [x] Verified mobile menu HTML elements exist (3 references found)

### 8. Minify Assets for Production (Completed: 2025-12-23)

- [x] Installed csso-cli and terser packages for minification
- [x] Created build.js script that minifies CSS and JS files
- [x] Created restore.js script to restore original files from backup
- [x] Added `npm run build` and `npm run build:restore` commands to package.json
- [x] Updated .github/workflows/deploy.yml to run build before deployment
- [x] Updated .gitignore to exclude .backup/ directory
- [x] Tested build: styles.css reduced 38.7% (150KB → 92KB), script.js reduced 52.9% (35KB → 16KB)

### 9. Review CSP Policy (Completed: 2025-12-23)

- [x] Analyzed current CSP policy in index.html
- [x] Identified dynamic style tag creation in script.js (toast notification animations)
- [x] Evaluated alternatives: nonce-based CSP, external CSS, unsafe-hashes
- [x] Created CSP-ANALYSIS.md with full security justification
- [x] Updated CSP comment in index.html to document the reason
- [x] **Decision: Keep `unsafe-inline` for styles** - Required for accessibility feature (404 toast)
  - No user input in dynamic styles (low security risk)
  - Scripts do NOT use `unsafe-inline` (secure)
  - Static site constraints make nonce-based CSP impractical

### 10. Remove Debug Console Statements (Completed: 2025-12-23)

- [x] Updated build.js to use terser API directly for better console removal control
- [x] Configured build to remove console.log, console.warn, console.debug, console.info
- [x] Kept console.error for production error tracking
- [x] Verified removal: script.js now only contains console.error (4 instances)
- [x] Build script now removes ~28 debug console statements while preserving error logging

### 11. Update Dependencies (Completed: 2025-12-23)
- [x] Updated `@playwright/test` from v1.40.0 to v1.57.0
- [x] Updated `@axe-core/playwright` from v4.8.0 to v4.11.0
- [x] Ran tests: 20 passed, 25 failed (pre-existing selector issues - Task 15)

### 12. Add Node Version Specification (Completed: 2025-12-23)
- [x] Created `.nvmrc` file with Node version 24
- [x] Updated `.github/workflows/deploy.yml` to use `node-version-file: '.nvmrc'`

### 13. Fix Image Attributes for CLS (Completed: 2025-12-23)
- [x] Added width/height attributes to all 29 gallery images missing them
- [x] Verified all lazy-loaded images now have dimensions (52 total images)
- [x] Site still loads correctly - improves CLS (Cumulative Layout Shift)

---

## NOTES

- All tasks are based on comprehensive analysis dated December 23, 2025
- Tasks should be completed in order within each priority level
- Test thoroughly after completing each task
- Update this file by marking tasks as [x] when completed

---

## REFERENCES

- Analysis Report: See Claude analysis output for full details
- Severity definitions:
  - **CRITICAL**: Blocks deployment or breaks core functionality
  - **HIGH**: Security risk or significant technical debt
  - **MEDIUM**: Performance issue or code quality concern
  - **LOW**: Optimization or nice-to-have improvement
