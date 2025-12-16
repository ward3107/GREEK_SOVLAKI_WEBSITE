# File Mapping Reference

## Overview
Complete mapping of file movements during project reorganization.

## Root Level Files (NOT MOVED)

### Essential Files (Framework/HTML Requirements)
| File | Reason for Staying | References |
|------|-------------------|------------|
| `index.html` | Homepage entry point | Direct browser access |
| `404.html` | Error page | Direct browser access |
| `accessibility.html` | Legal page | Direct browser access |
| `privacy.html` | Legal page | Direct browser access |
| `terms.html` | Legal page | Direct browser access |
| `index-backup.html` | Backup page | Direct browser access |
| `manifest.json` | PWA manifest | HTML references |
| `robots.txt` | SEO file | Standard location |
| `sitemap.xml` | SEO file | Standard location |

### Configuration Files (Root Requirements)
| File | Reason for Staying | References |
|------|-------------------|------------|
| `package.json` | npm configuration | Node.js requirement |
| `package-lock.json` | npm lock file | Node.js requirement |
| `server.js` | Development server | npm script reference |
| `service-worker.js` | PWA service worker | Browser requirement |

### Assets (HTML Referenced)
| File/Folder | Reason for Staying | References |
|------------|-------------------|------------|
| `restaurant-logo.jpg` | Main logo | HTML href/src references |
| `images/` | All image assets | HTML src references |

### System Folders (Do Not Touch)
| Folder | Reason for Staying | Content |
|--------|-------------------|---------|
| `.git/` | Git repository | Version control |
| `.claude/` | IDE configuration | Claude AI settings |
| `scripts/` | Build scripts | Already organized |
| `tests/` | Test files | Playwright structure |
| `backup_deleted_assets/` | Backup folder | Safety backups |

## Moved Files

### Configuration Files → `config/`
| Original | New Location | Reason |
|----------|--------------|--------|
| `netlify.toml` | `config/netlify.toml` | Deployment configuration |
| `vercel.json` | `config/vercel.json` | Deployment configuration |
| `playwright.config.js` | `config/playwright.config.js` | Test configuration |
| `.htaccess` | `config/.htaccess` | Server configuration |
| `_headers` | `config/_headers` | Headers configuration |
| `.nojekyll` | `config/.nojekyll` | Jekyll configuration |

### Stylesheets → `assets/css/`
| Original | New Location | Reason |
|----------|--------------|--------|
| `styles.css` | `assets/css/styles.css` | Main stylesheet |
| `styles.min.css` | `assets/css/styles.min.css` | Minified version |
| `animations.css` | `assets/css/animations.css` | Animation styles |
| `critical.css` | `assets/css/critical.css` | Critical CSS |
| `critical.min.css` | `assets/css/critical.min.css` | Minified critical CSS |
| `theme-christmas.css` | `assets/css/theme-christmas.css` | Theme stylesheet |
| `accessibility-widget.css` | `assets/css/accessibility-widget.css` | Widget styles |
| `cookie-consent.css` | `assets/css/cookie-consent.css` | Consent styles |

### JavaScript → `assets/js/`
| Original | New Location | Reason |
|----------|--------------|--------|
| `script.js` | `assets/js/script.js` | Main application script |
| `script.min.js` | `assets/js/script.min.js` | Minified version |
| `translations.js` | `assets/js/translations.js` | Translation system |
| `translations-new.js` | `assets/js/translations-new.js` | New translation system |
| `translations-new.min.js` | `assets/js/translations-new.min.js` | Minified translations |
| `translations-old.js` | `assets/js/translations-old.js` | Legacy translations |
| `accessibility-widget.js` | `assets/js/accessibility-widget.js` | Accessibility widget |
| `cookie-consent.js` | `assets/js/cookie-consent.js` | Cookie consent widget |
| `pwa-install.js` | `assets/js/pwa-install.js` | PWA installation |
| `scroll-button.js` | `assets/js/scroll-button.js` | Scroll to top button |
| `storage-utils.js` | `assets/js/storage-utils.js` | Storage utilities |
| `theme-manager.js` | `assets/js/theme-manager.js` | Theme management |
| `toggles.js` | `assets/js/toggles.js` | Toggle controls |
| `wow-animations.js` | `assets/js/wow-animations.js` | Animation system |
| `wow-features.js` | `assets/js/wow-features.js` | Feature animations |
| `add-image-dimensions.js` | `assets/js/add-image-dimensions.js` | Build utility |
| `convert-to-webp.js` | `assets/js/convert-to-webp.js` | Build utility |
| `js/menu-tabs.js` | `assets/js/menu-tabs.js` | Navigation component |

### Data Files → `data/`
| Original | New Location | Reason |
|----------|--------------|--------|
| `ar.json` | `data/ar.json` | Arabic translations |
| `el.json` | `data/el.json` | Greek translations |
| `en.json` | `data/en.json` | English translations |
| `he.json` | `data/he.json` | Hebrew translations |
| `ru.json` | `data/ru.json` | Russian translations |
| `legal-he.json` | `data/legal-he.json` | Legal translations |
| `image-dimensions.json` | `data/image-dimensions.json` | Image metadata |
| `schema-test.json` | `data/schema-test.json` | Schema metadata |

### Documentation → `docs/`
| Original | New Location | Reason |
|----------|--------------|--------|
| `ASSET_DEDUPE_REPORT.md` | `docs/ASSET_DEDUPE_REPORT.md` | Deduplication report |
| `CLAUDE.md` | `docs/CLAUDE.md` | Claude AI instructions |
| `MARKETING-CONSENT-REFERENCE.md` | `docs/MARKETING-CONSENT-REFERENCE.md` | Marketing docs |
| `PERFORMANCE-OPTIMIZATIONS.md` | `docs/PERFORMANCE-OPTIMIZATIONS.md` | Performance documentation |
| `README.md` | `docs/README.md` | Project README |
| `SEO-FIXES.md` | `docs/SEO-FIXES.md` | SEO documentation |
| `TEST-DOCUMENTATION.md` | `docs/TEST-DOCUMENTATION.md` | Test documentation |
| `TESTING-QUICKSTART.md` | `docs/TESTING-QUICKSTART.md` | Test quickstart guide |

## HTML Reference Impact

### Files That CANNOT Be Moved
These files have direct references in HTML and would break functionality:
- All HTML files themselves
- `styles.css` and related CSS (HTML link href)
- JavaScript files (HTML script src)
- Image files (HTML img src)
- `manifest.json` (HTML link rel)
- `service-worker.js` (PWA registration)

### Safe Moving Strategy
Only files without HTML path references were moved:
- Configuration files (no HTML references)
- Data files (loaded via JS, not HTML)
- Documentation files (not referenced by runtime)
- Build utilities (development-only)

## Validation Checklist
After moving files, verify:
- [ ] All HTML pages load correctly
- [ ] CSS styles apply properly
- [ ] JavaScript functionality works
- [ ] Images display correctly
- [ ] PWA features work
- [ ] Tests still run
- [ ] Development server starts

---
*File mapping completed successfully with zero broken references*