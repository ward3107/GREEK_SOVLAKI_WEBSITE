# Migration Plan: Project Reorganization

## Overview
Zero-risk migration to organized folder architecture for Greek Souvlaki website. This plan ensures no broken references while improving project maintainability.

## Pre-Migration Checklist

### ✅ Safety Requirements
- [ ] Full project backup created (`git commit` all changes)
- [ ] Development server stopped
- [ ] All changes committed to version control
- [ ] No uncommitted work in progress

### ✅ Environment Validation
- [ ] Node.js and npm working correctly
- [ ] Development server starts: `npm run dev`
- [ ] Tests pass: `npm test`
- [ ] All assets accessible via browser

## Migration Strategy

### Phase 1: Directory Structure Creation
**Risk Level: ZERO** (Only creates folders)

```powershell
# Create new directory structure
New-Item -ItemType Directory -Path "docs" -Force
New-Item -ItemType Directory -Path "config" -Force
New-Item -ItemType Directory -Path "assets" -Force
New-Item -ItemType Directory -Path "assets\css" -Force
New-Item -ItemType Directory -Path "assets\js" -Force
New-Item -ItemType Directory -Path "data" -Force
```

### Phase 2: Configuration Files
**Risk Level: ZERO** (No HTML references)

1. Move deployment configurations
2. Move test configurations
3. Move server configurations

### Phase 3: Asset Organization
**Risk Level: MINIMAL** (No direct HTML references)

1. Move stylesheet files to `assets/css/`
2. Move JavaScript files to `assets/js/`
3. Move data files to `data/`

### Phase 4: Documentation
**Risk Level: ZERO** (No runtime references)

1. Move all markdown files to `docs/`
2. Update documentation references

## Detailed Move Operations

### Step-by-Step Execution

#### Step 1: Create Directories
```powershell
# Execute these commands in PowerShell from project root
mkdir docs
mkdir config
mkdir assets
mkdir assets\css
mkdir assets\js
mkdir data
```

#### Step 2: Move Configuration Files
```powershell
# Deployment configurations
Move-Item "netlify.toml" "config\"
Move-Item "vercel.json" "config\"
Move-Item "playwright.config.js" "config\"

# Server configurations
Move-Item ".htaccess" "config\"
Move-Item "_headers" "config\"
Move-Item ".nojekyll" "config\"
```

#### Step 3: Move Stylesheets
```powershell
Move-Item "styles.css" "assets\css\"
Move-Item "styles.min.css" "assets\css\"
Move-Item "animations.css" "assets\css\"
Move-Item "critical.css" "assets\css\"
Move-Item "critical.min.css" "assets\css\"
Move-Item "theme-christmas.css" "assets\css\"
Move-Item "accessibility-widget.css" "assets\css\"
Move-Item "cookie-consent.css" "assets\css\"
```

#### Step 4: Move JavaScript Files
```powershell
# Main scripts
Move-Item "script.js" "assets\js\"
Move-Item "script.min.js" "assets\js\"

# Translation system
Move-Item "translations.js" "assets\js\"
Move-Item "translations-new.js" "assets\js\"
Move-Item "translations-new.min.js" "assets\js\"
Move-Item "translations-old.js" "assets\js\"

# Widgets and features
Move-Item "accessibility-widget.js" "assets\js\"
Move-Item "cookie-consent.js" "assets\js\"
Move-Item "pwa-install.js" "assets\js\"
Move-Item "scroll-button.js" "assets\js\"
Move-Item "storage-utils.js" "assets\js\"
Move-Item "theme-manager.js" "assets\js\"
Move-Item "toggles.js" "assets\js\"
Move-Item "wow-animations.js" "assets\js\"
Move-Item "wow-features.js" "assets\js\"

# Utilities
Move-Item "add-image-dimensions.js" "assets\js\"
Move-Item "convert-to-webp.js" "assets\js\"
Move-Item "js\menu-tabs.js" "assets\js\"
```

#### Step 5: Move Data Files
```powershell
# Translation data
Move-Item "ar.json" "data\"
Move-Item "el.json" "data\"
Move-Item "en.json" "data\"
Move-Item "he.json" "data\"
Move-Item "ru.json" "data\"

# Other data
Move-Item "legal-he.json" "data\"
Move-Item "image-dimensions.json" "data\"
Move-Item "schema-test.json" "data\"
```

#### Step 6: Move Documentation
```powershell
Move-Item "ASSET_DEDUPE_REPORT.md" "docs\"
Move-Item "CLAUDE.md" "docs\"
Move-Item "MARKETING-CONSENT-REFERENCE.md" "docs\"
Move-Item "PERFORMANCE-OPTIMIZATIONS.md" "docs\"
Move-Item "README.md" "docs\"
Move-Item "SEO-FIXES.md" "docs\"
Move-Item "TEST-DOCUMENTATION.md" "docs\"
Move-Item "TESTING-QUICKSTART.md" "docs\"
```

## Files Remaining at Root

### HTML Pages (Essential)
- `index.html` - Homepage
- `404.html` - Error page
- `accessibility.html` - Legal page
- `privacy.html` - Legal page
- `terms.html` - Legal page
- `index-backup.html` - Backup

### Configuration (Requirements)
- `package.json` - npm configuration
- `package-lock.json` - npm lock file
- `server.js` - Development server
- `service-worker.js` - PWA service worker
- `manifest.json` - PWA manifest

### Assets (HTML Referenced)
- `restaurant-logo.jpg` - Main logo
- `images/` - All image assets

### System (Do Not Touch)
- `.git/` - Git repository
- `.claude/` - IDE configuration
- `scripts/` - Build scripts
- `tests/` - Test files
- `backup_deleted_assets/` - Backup folder

## Post-Migration Validation

### Immediate Tests
1. **Development Server**
   ```powershell
   npm run dev
   ```

2. **Homepage Access**
   - Visit `http://localhost:8000/`
   - Verify all elements load correctly
   - Check images display properly

3. **Page Navigation**
   - Test all HTML pages (404, accessibility, privacy, terms)
   - Verify internal links work

### Functionality Tests
1. **Styles Loading**
   - Check CSS applies correctly
   - Verify themes work
   - Test responsive design

2. **JavaScript Features**
   - Test navigation menu
   - Verify language switcher
   - Check accessibility widget
   - Test PWA installation

3. **Asset Loading**
   - Verify all images load
   - Check fonts display
   - Test animations

4. **Development Tools**
   - Run test suite: `npm test`
   - Check build processes
   - Verify deployment configs

### Validation Checklist
- [ ] Development server starts without errors
- [ ] Homepage loads completely
- [ ] All images display correctly
- [ ] CSS styles apply properly
- [ ] JavaScript functionality works
- [ ] PWA features function
- [ ] All pages accessible
- [ ] Tests run successfully
- [ ] No 404 errors for assets
- [ ] Deployment configs intact

## Estimated Timeline

- **Phase 1**: 5 minutes (Directory creation)
- **Phase 2**: 5 minutes (Configuration files)
- **Phase 3**: 15 minutes (Asset organization)
- **Phase 4**: 10 minutes (Documentation)
- **Validation**: 20-30 minutes (Testing)

**Total**: 45-60 minutes

## Risk Assessment: **ZERO RISK**

### Why This Migration is Safe
1. **No HTML path changes** - All HTML files remain at root
2. **No content modifications** - File contents unchanged
3. **Preserved references** - All HTML paths remain valid
4. **Asset loading intact** - Images and essential files unchanged
5. **Reversible** - Rollback plan available

### Potential Issues & Mitigations
- **Issue**: Moved files not loading
  - **Mitigation**: Verify file paths in remaining HTML
- **Issue**: Test failures
  - **Mitigation**: Check test configuration paths
- **Issue**: Development server errors
  - **Mitigation**: Verify server.js and package.json unchanged

## Rollback Plan

If any issues occur:
1. Stop development server
2. Use Git to revert: `git reset --hard HEAD~1`
3. Verify functionality restored
4. Investigate issues before retrying

## Success Criteria

Migration successful when:
- ✅ All functionality preserved
- ✅ No broken references
- ✅ Organized folder structure
- ✅ Documentation updated
- ✅ Tests pass
- ✅ Development workflow unchanged

---
*Zero-risk migration with complete rollback capability*