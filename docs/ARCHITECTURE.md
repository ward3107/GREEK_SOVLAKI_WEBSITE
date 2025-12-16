# Project Architecture

## Overview
Greek Souvlaki Restaurant Website - A multilingual, PWA-enabled restaurant website built with vanilla HTML/CSS/JavaScript.

## Architecture Principles

### 1. Zero-Risk Organization
- **No file deletions** - All files preserved, only reorganized
- **No content changes** - File contents remain untouched
- **Path safety** - Files with HTML references stay at root level
- **Move-only approach** - Only creating folders and moving files

### 2. Static Site Structure
```
ROOT LEVEL (Critical Files - DO NOT MOVE)
├── index.html              # Homepage entry point
├── *.html                  # All HTML pages (404, accessibility, privacy, terms)
├── manifest.json           # PWA manifest
├── service-worker.js       # PWA service worker
├── package.json            # npm configuration
├── server.js               # Development server
├── images/                 # Static images (HTML referenced)
└── tests/                  # Playwright tests

ORGANIZED FOLDERS (Safe to move)
├── docs/                   # All documentation
├── config/                 # Deployment and build configuration
├── assets/                 # Static assets
│   ├── css/               # All stylesheets
│   └── js/                # All JavaScript files
└── data/                   # JSON data files
```

### 3. Folder Responsibilities

#### `/docs/` - Documentation
All project documentation, guides, and reports
- README.md - Project overview
- CLAUDE.md - Claude AI instructions
- ASSET_DEDUPE_REPORT.md - Asset analysis reports
- Performance and SEO documentation

#### `/config/` - Configuration
Deployment, build, and development configuration
- Deployment configs (netlify.toml, vercel.json)
- Test configuration (playwright.config.js)
- Server configurations (.htaccess, headers)

#### `/assets/` - Static Assets
All static assets used by the website
- `/css/` - Stylesheets (themes, components, critical CSS)
- `/js/` - JavaScript (modules, utilities, widgets)

#### `/data/` - Data Files
JSON data files for internationalization and metadata
- Translation files (ar.json, en.json, he.json, etc.)
- Image metadata and schemas

### 4. Import/Reference Safety
Files with direct HTML references remain at root:
- **HTML pages** - Direct browser access
- **Manifest & PWA files** - Browser requirements
- **Images folder** - Relative path references
- **Package configs** - Node.js requirements

### 5. Build & Deployment Considerations
- **Static hosting ready** - Works with any static host
- **PWA compatible** - Service worker at root level
- **CDN friendly** - Organized asset structure
- **Development preserved** - Local dev server unchanged

## Key Decisions

### Why Hybrid Approach?
- **Static site constraints** - HTML files need relative path access
- **Zero-risk requirement** - No broken references
- **Developer experience** - Familiar structure maintained
- **Tool compatibility** - Works with existing build/deployment tools

### Why Not Full `src/` Structure?
- **No build step** - Pure static site with relative paths
- **HTML constraints** - Direct file references would break
- **PWA requirements** - Service worker must be at root
- **Deployment simplicity** - Works on any static host

## Migration Benefits
- ✅ **Cleaner root** - Only essential files at root level
- ✅ **Logical grouping** - Files grouped by function
- ✅ **Maintainability** - Easy to find and organize files
- ✅ **Scalability** - Room for future growth
- ✅ **Zero risk** - No functionality changes
- ✅ **Documentation** - Clear architecture and file maps

## Future Considerations
- **Build system** - Can easily migrate to bundler if needed
- **Framework adoption** - Structure compatible with React/Vue
- **Component system** - Asset organization ready for components
- **Performance** - CDN-friendly structure for optimization

---
*Architecture designed for safety, maintainability, and scalability*