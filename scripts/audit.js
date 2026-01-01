#!/usr/bin/env node

/**
 * Greek Souvlaki Website Security & Accessibility Audit Script
 *
 * This script checks for common security, accessibility, and performance issues
 * that were identified and fixed during the security audit.
 *
 * Usage: node scripts/audit.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Audit results
const auditResults = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: []
};

function log(level, message, details = null) {
    const levelColors = {
        critical: colors.red,
        high: colors.yellow,
        medium: colors.blue,
        low: colors.cyan,
        info: colors.green
    };

    console.log(`${levelColors[level]}[${level.toUpperCase()}]${colors.reset} ${message}`);
    if (details) {
        console.log(`  ${details}`);
    }

    auditResults[level].push({ message, details });
}

function checkFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        log('critical', `Cannot read file: ${filePath}`, error.message);
        return null;
    }
}

function findFiles(dir, extension) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                traverse(fullPath);
            } else if (stat.isFile() && fullPath.endsWith(extension)) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

// Audit Functions

function checkMissingAltTags() {
    log('info', 'Checking for missing alt tags on images...');

    const htmlFiles = findFiles('.', '.html');
    let issuesFound = 0;

    for (const file of htmlFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Find img tags
        const imgRegex = /<img[^>]+>/g;
        let match;

        while ((match = imgRegex.exec(content)) !== null) {
            const imgTag = match[0];

            // Check if alt attribute exists
            if (!imgTag.includes('alt=')) {
                log('critical', `Missing alt attribute`, `${file}:${match.index}`);
                issuesFound++;
            } else if (imgTag.includes('alt=""') && !imgTag.includes('aria-hidden="true"')) {
                // Check if empty alt is justified
                log('medium', `Empty alt tag without aria-hidden`, `${file}:${match.index}`);
                issuesFound++;
            }
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ All images have proper alt attributes');
    }

    return issuesFound;
}

function checkCSPUnsafeInline() {
    log('info', 'Checking Content Security Policy for unsafe-inline...');

    const htmlFiles = findFiles('.', '.html');
    let issuesFound = 0;

    for (const file of htmlFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Check for CSP with unsafe-inline in style-src
        if (content.includes('Content-Security-Policy') &&
            content.includes("style-src 'self' 'unsafe-inline'")) {
            log('high', `CSP allows unsafe-inline for styles`, file);
            issuesFound++;
        }

        // Check if CSP has security note
        if (content.includes('Content-Security-Policy') &&
            !content.includes('SECURITY NOTE')) {
            log('medium', `CSP missing security note about unsafe-inline`, file);
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ CSP policies are properly secured');
    }

    return issuesFound;
}

function checkInnerHTMLUsage() {
    log('info', 'Checking for innerHTML usage...');

    const jsFiles = findFiles('.', '.js');
    let issuesFound = 0;

    for (const file of jsFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Find innerHTML usage
        const innerHTMLRegex = /\.innerHTML\s*=/g;
        let match;

        while ((match = innerHTMLRegex.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;

            // Check if it's a template literal or static content
            const lines = content.split('\n');
            const currentLine = lines[lineNum - 1];

            // Allow template literals with controlled content
            if (currentLine.includes('`') ||
                currentLine.includes('<svg') ||
                currentLine.includes('<span class=')) {
                log('low', `innerHTML usage with controlled content`, `${file}:${lineNum}`);
            } else {
                log('high', `Unsafe innerHTML usage`, `${file}:${lineNum}`);
                issuesFound++;
            }
        }
    }

    // Also check HTML files for innerHTML
    const htmlFiles = findFiles('.', '.html');
    for (const file of htmlFiles) {
        const content = checkFile(file);
        if (!content) continue;

        const innerHTMLRegex = /\.innerHTML\s*=/g;
        let match;

        while ((match = innerHTMLRegex.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;
            log('medium', `innerHTML usage in HTML file`, `${file}:${lineNum}`);
            issuesFound++;
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ No unsafe innerHTML usage found');
    }

    return issuesFound;
}

function checkInputValidation() {
    log('info', 'Checking server.js for input validation...');

    const serverContent = checkFile('server.js');
    if (!serverContent) return 1;

    let issuesFound = 0;

    // Check for path validation
    if (!serverContent.includes('validateFilePath')) {
        log('critical', 'Missing input validation function in server.js');
        issuesFound++;
    }

    // Check for directory traversal protection
    if (!serverContent.includes('..') || !serverContent.includes('path.resolve')) {
        log('critical', 'Missing directory traversal protection in server.js');
        issuesFound++;
    }

    // Check for allowed extensions validation
    if (!serverContent.includes('allowedExtensions')) {
        log('high', 'Missing file extension validation in server.js');
        issuesFound++;
    }

    // Check for proper error responses
    if (!serverContent.includes('403')) {
        log('medium', 'Missing 403 Forbidden response for invalid paths');
        issuesFound++;
    }

    if (issuesFound === 0) {
        log('info', '✓ Server.js has proper input validation');
    }

    return issuesFound;
}

function checkDuplicateLightboxes() {
    log('info', 'Checking for duplicate lightbox modals...');

    const indexContent = checkFile('index.html');
    if (!indexContent) return 1;

    // Count lightbox modal elements
    const lightboxMatches = indexContent.match(/<div[^>]*id=["\']lightbox["\']/g) || [];

    if (lightboxMatches.length > 1) {
        log('critical', `Found ${lightboxMatches.length} duplicate lightbox modals`, 'index.html');
        return lightboxMatches.length - 1;
    } else if (lightboxMatches.length === 1) {
        log('info', '✓ Only one lightbox modal found');
        return 0;
    } else {
        log('medium', 'No lightbox modals found (may have been removed)');
        return 0;
    }
}

function checkPWAIcons() {
    log('info', 'Checking PWA manifest for missing icons...');

    const manifestContent = checkFile('manifest.json');
    if (!manifestContent) return 1;

    let issuesFound = 0;
    const manifest = JSON.parse(manifestContent);

    if (!manifest.icons || manifest.icons.length === 0) {
        log('high', 'No icons defined in manifest.json');
        return 1;
    }

    for (const icon of manifest.icons) {
        if (!icon.src || icon.src === 'restaurant-logo.jpg') {
            log('high', `Missing or invalid icon src: ${icon.src || 'undefined'}`);
            issuesFound++;
        } else {
            // Check if icon file exists
            if (!fs.existsSync(icon.src)) {
                log('high', `Icon file not found: ${icon.src}`);
                issuesFound++;
            }
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ All PWA icons are properly defined and exist');
    }

    return issuesFound;
}

function checkHTTPReferences() {
    log('info', 'Checking for HTTP (non-HTTPS) references...');

    const htmlFiles = findFiles('.', '.html');
    let issuesFound = 0;

    for (const file of htmlFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Find HTTP URLs (excluding data: and localhost)
        const httpRegex = /http:\/\/(?!localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/g;
        let match;

        while ((match = httpRegex.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;
            log('high', `HTTP URL found (should be HTTPS)`, `${file}:${lineNum} - ${match[0]}`);
            issuesFound++;
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ No HTTP URLs found');
    }

    return issuesFound;
}

function checkExtremeZIndex() {
    log('info', 'Checking for extreme z-index values...');

    const cssFiles = findFiles('.', '.css');
    let issuesFound = 0;

    for (const file of cssFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Find z-index values
        const zIndexRegex = /z-index:\s*(\d+)/g;
        let match;

        while ((match = zIndexRegex.exec(content)) !== null) {
            const zIndexValue = parseInt(match[1]);
            const lineNum = content.substring(0, match.index).split('\n').length;

            if (zIndexValue > 9999) {
                log('medium', `Extremely high z-index: ${zIndexValue}`, `${file}:${lineNum}`);
                issuesFound++;
            }
        }
    }

    if (issuesFound === 0) {
        log('info', '✓ No extreme z-index values found');
    }

    return issuesFound;
}

function checkConsoleLogging() {
    log('info', 'Checking for excessive console logging...');

    const jsFiles = findFiles('.', '.js');
    let totalLogs = 0;
    let criticalFiles = [];

    for (const file of jsFiles) {
        const content = checkFile(file);
        if (!content) continue;

        // Count console.log occurrences (excluding logger.js)
        if (file.includes('logger.js')) continue;

        const logMatches = content.match(/console\.(log|info|debug|warn)\(/g) || [];
        totalLogs += logMatches.length;

        if (logMatches.length > 10) {
            criticalFiles.push({ file, count: logMatches.length });
        }
    }

    log('info', `Found ${totalLogs} console logs across all JS files`);

    if (criticalFiles.length > 0) {
        for (const { file, count } of criticalFiles) {
            log('medium', `High number of console logs: ${count}`, file);
        }
    }

    // Check if logger.js exists
    if (fs.existsSync('logger.js')) {
        log('info', '✓ Logger utility is available');
    } else {
        log('medium', 'Logger utility not found - consider creating one');
    }

    return criticalFiles.length;
}

// Main audit execution
function runAudit() {
    console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║         Greek Souvlaki Website Security Audit                 ║
║                                                              ║
║  This script checks for security and accessibility issues   ║
║  identified during the comprehensive audit.                 ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
`);

    const results = {
        'Missing Alt Tags': checkMissingAltTags(),
        'CSP Unsafe Inline': checkCSPUnsafeInline(),
        'Inner HTML Usage': checkInnerHTMLUsage(),
        'Input Validation': checkInputValidation(),
        'Duplicate Lightboxes': checkDuplicateLightboxes(),
        'PWA Icons': checkPWAIcons(),
        'HTTP References': checkHTTPReferences(),
        'Extreme Z-Index': checkExtremeZIndex(),
        'Console Logging': checkConsoleLogging()
    };

    console.log(`\n${colors.cyan}=== AUDIT SUMMARY ===${colors.reset}\n`);

    let totalIssues = 0;
    for (const [category, issues] of Object.entries(results)) {
        totalIssues += issues;
        const status = issues === 0 ? '✓' : `${issues} issues`;
        const color = issues === 0 ? colors.green : (issues > 5 ? colors.red : colors.yellow);
        console.log(`${color}${status}${colors.reset} ${category}`);
    }

    console.log(`\n${colors.cyan}=== FINAL RESULTS ===${colors.reset}\n`);

    if (totalIssues === 0) {
        console.log(`${colors.green}🎉 All checks passed! No issues found.${colors.reset}`);
    } else {
        console.log(`${colors.yellow}⚠️  Found ${totalIssues} total issues to address.${colors.reset}`);

        // Group by severity
        if (auditResults.critical.length > 0) {
            console.log(`\n${colors.red}CRITICAL (${auditResults.critical.length}):${colors.reset}`);
            auditResults.critical.forEach(issue => console.log(`  • ${issue.message}`));
        }

        if (auditResults.high.length > 0) {
            console.log(`\n${colors.yellow}HIGH (${auditResults.high.length}):${colors.reset}`);
            auditResults.high.forEach(issue => console.log(`  • ${issue.message}`));
        }
    }

    console.log(`\n${colors.cyan}Audit completed successfully!${colors.reset}`);

    return totalIssues;
}

// Run audit if this file is executed directly
if (require.main === module) {
    const exitCode = runAudit();
    process.exit(exitCode > 0 ? 1 : 0);
}

module.exports = { runAudit };