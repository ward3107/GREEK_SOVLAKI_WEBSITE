# Rollback Plan: Project Reorganization

## Overview
Emergency rollback procedures for the project reorganization. Ensures immediate restoration of functionality if issues arise.

## Quick Rollback (Git Method)

### Prerequisites
- Git repository with clean state before migration
- All migration changes committed

### Steps
```bash
# 1. Stop development server
Ctrl+C (in terminal running npm run dev)

# 2. Reset to pre-migration state
git reset --hard HEAD~1

# 3. Verify restoration
git status

# 4. Restart development server
npm run dev

# 5. Test functionality
# Visit http://localhost:8000/
```

### What This Restores
- ✅ All files returned to original locations
- ✅ Original folder structure restored
- ✅ All HTML references restored
- ✅ Development workflow unchanged

## Manual Rollback (File by File)

If Git is not available or you prefer manual restoration:

### Step 1: Create Restoration Directory
```powershell
# Create temporary directory for moved files
mkdir temp_restore
```

### Step 2: Move Files Back to Root

#### Configuration Files
```powershell
Move-Item "config\netlify.toml" ".\"
Move-Item "config\vercel.json" ".\"
Move-Item "config\playwright.config.js" ".\"
Move-Item "config\.htaccess" ".\"
Move-Item "config\_headers" ".\"
Move-Item "config\.nojekyll" ".\"
```

#### Stylesheet Files
```powershell
Move-Item "assets\css\styles.css" ".\"
Move-Item "assets\css\styles.min.css" ".\"
Move-Item "assets\css\animations.css" ".\"
Move-Item "assets\css\critical.css" ".\"
Move-Item "assets\css\critical.min.css" ".\"
Move-Item "assets\css\theme-christmas.css" ".\"
Move-Item "assets\css\accessibility-widget.css" ".\"
Move-Item "assets\css\cookie-consent.css" ".\"
```

#### JavaScript Files
```powershell
Move-Item "assets\js\script.js" ".\"
Move-Item "assets\js\script.min.js" ".\"
Move-Item "assets\js\translations.js" ".\"
Move-Item "assets\js\translations-new.js" ".\"
Move-Item "assets\js\translations-new.min.js" ".\"
Move-Item "assets\js\translations-old.js" ".\"
Move-Item "assets\js\accessibility-widget.js" ".\"
Move-Item "assets\js\cookie-consent.js" ".\"
Move-Item "assets\js\pwa-install.js" ".\"
Move-Item "assets\js\scroll-button.js" ".\"
Move-Item "assets\js\storage-utils.js" ".\"
Move-Item "assets\js\theme-manager.js" ".\"
Move-Item "assets\js\toggles.js" ".\"
Move-Item "assets\js\wow-animations.js" ".\"
Move-Item "assets\js\wow-features.js" ".\"
Move-Item "assets\js\add-image-dimensions.js" ".\"
Move-Item "assets\js\convert-to-webp.js" ".\"
Move-Item "assets\js\menu-tabs.js" ".\"

# Restore original js folder
Move-Item "assets\js\menu-tabs.js" "js\menu-tabs.js"
```

#### Data Files
```powershell
Move-Item "data\ar.json" ".\"
Move-Item "data\el.json" ".\"
Move-Item "data\en.json" ".\"
Move-Item "data\he.json" ".\"
Move-Item "data\ru.json" ".\"
Move-Item "data\legal-he.json" ".\"
Move-Item "data\image-dimensions.json" ".\"
Move-Item "data\schema-test.json" ".\"
```

#### Documentation Files
```powershell
Move-Item "docs\ASSET_DEDUPE_REPORT.md" ".\"
Move-Item "docs\CLAUDE.md" ".\"
Move-Item "docs\MARKETING-CONSENT-REFERENCE.md" ".\"
Move-Item "docs\PERFORMANCE-OPTIMIZATIONS.md" ".\"
Move-Item "docs\README.md" ".\"
Move-Item "docs\SEO-FIXES.md" ".\"
Move-Item "docs\TEST-DOCUMENTATION.md" ".\"
Move-Item "docs\TESTING-QUICKSTART.md" ".\"
```

### Step 3: Remove New Directory Structure
```powershell
# Remove created directories (only if empty)
Remove-Item "config" -Recurse -Force
Remove-Item "assets" -Recurse -Force
Remove-Item "data" -Recurse -Force
Remove-Item "docs" -Recurse -Force
```

## Partial Rollback (Selective)

If only certain aspects need rollback:

### Rollback CSS/JS Only
```powershell
# Move back stylesheets and JavaScript
Move-Item "assets\css\*" ".\"
Move-Item "assets\js\*" ".\"
```

### Rollback Data Files Only
```powershell
# Move back JSON data files
Move-Item "data\*.json" ".\"
```

### Rollback Documentation Only
```powershell
# Move back markdown files
Move-Item "docs\*.md" ".\"
```

## Verification After Rollback

### Essential Checks
1. **Development Server**
   ```powershell
   npm run dev
   ```

2. **Homepage Loading**
   - Visit `http://localhost:8000/`
   - Verify all elements display

3. **Asset Loading**
   - Check images load correctly
   - Verify CSS applies
   - Test JavaScript functionality

4. **Page Navigation**
   - Test all HTML pages
   - Verify internal links

5. **Development Tools**
   - Run tests: `npm test`
   - Check build processes

### Rollback Success Criteria
- ✅ Development server starts without errors
- ✅ Homepage loads completely
- ✅ All images and styles display
- ✅ JavaScript functionality works
- ✅ All pages accessible
- ✅ Tests run successfully

## Emergency Scenarios

### Scenario 1: Development Server Won't Start
**Solution**: Quick Git rollback
```bash
git reset --hard HEAD~1
npm run dev
```

### Scenario 2: Assets Not Loading (404 Errors)
**Solution**: Manual file restoration
```powershell
# Move back CSS and JS files
Move-Item "assets\css\*" ".\"
Move-Item "assets\js\*" ".\"
```

### Scenario 3: Tests Failing
**Solution**: Restore test configuration
```powershell
Move-Item "config\playwright.config.js" ".\"
npm test
```

### Scenario 4: Deployment Issues
**Solution**: Restore deployment configs
```powershell
Move-Item "config\netlify.toml" ".\"
Move-Item "config\vercel.json" ".\"
```

## Rollback Time Estimation

- **Git rollback**: 2-3 minutes
- **Manual rollback**: 10-15 minutes
- **Partial rollback**: 5-10 minutes
- **Verification**: 5-10 minutes

## Prevention of Future Issues

### Before Next Migration Attempt
1. **Complete Backup**: Full project backup
2. **Incremental Approach**: Move file groups individually
3. **Test Between Phases**: Verify after each group
4. **Documentation**: Keep detailed change log

### Monitoring During Migration
1. **Real-time Testing**: Check functionality after each move
2. **Error Logging**: Track any issues immediately
3. **Validation Points**: Test critical functionality

## Contact Information

For rollback assistance:
- **Primary**: Git reset (fastest, most reliable)
- **Secondary**: Manual file restoration
- **Emergency**: Restore from project backup

## Success Confirmation

Rollback successful when:
- ✅ Project matches pre-migration state
- ✅ All functionality restored
- ✅ No error messages
- ✅ Development workflow normal
- ✅ Tests pass completely

---

*Multiple rollback methods available for maximum safety*