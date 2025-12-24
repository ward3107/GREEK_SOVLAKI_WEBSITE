#!/usr/bin/env node

/**
 * Build script for Greek Souvlaki Website
 * Minifies CSS and JavaScript assets for production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const terser = require('terser');

const ASSETS = {
    css: [
        'styles.css',
        'animations.css',
        'cookie-consent.css'
    ],
    js: [
        'script.js',
        'translations-new.js',
        'toggles.js',
        'cookie-consent.js',
        'accessibility-widget.js',
        'wow-animations.js',
        'snow.js',
        'sw.js'
    ]
};

// Files to exclude from minification (already minified or very small)
const EXCLUDE = [
    'sw.js', // Service Worker - needs special handling
    'force-http.js' // Dev only file
];

console.log('🏗️  Starting build process...\n');

// Backup original files
console.log('📦 Creating backups...');
const backupDir = path.join(__dirname, '.backup');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const backup = (filePath) => {
    const fileName = path.basename(filePath);
    const backupPath = path.join(backupDir, fileName);
    fs.copyFileSync(filePath, backupPath);
};

// Minify CSS
console.log('\n🎨 Minifying CSS files...');
ASSETS.css.filter(file => !EXCLUDE.includes(file)).forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        backup(filePath);
        console.log(`  - ${file}`);
        try {
            execSync(`npx csso ${filePath} -o ${filePath}`, { stdio: 'pipe' });
            const originalSize = fs.statSync(path.join(backupDir, file)).size;
            const newSize = fs.statSync(filePath).size;
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
            console.log(`    ✅ Reduced by ${savings}% (${originalSize} → ${newSize} bytes)`);
        } catch (err) {
            console.error(`    ❌ Error minifying ${file}:`, err.message);
        }
    }
});

// Minify JS with console removal
async function minifyJS(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await terser.minify(code, {
        compress: {
            drop_console: false,
            pure_funcs: ['console.log', 'console.warn', 'console.debug', 'console.info']
        },
        mangle: true,
        format: {
            comments: false
        }
    });
    if (result.error) {
        throw result.error;
    }
    return result.code;
}

// Minify JS files
console.log('\n📜 Minifying JavaScript files...');
(async () => {
    for (const file of ASSETS.js.filter(f => !EXCLUDE.includes(f))) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            backup(filePath);
            console.log(`  - ${file}`);
            try {
                const minified = await minifyJS(filePath);
                fs.writeFileSync(filePath, minified);
                const originalSize = fs.statSync(path.join(backupDir, file)).size;
                const newSize = fs.statSync(filePath).size;
                const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
                console.log(`    ✅ Reduced by ${savings}% (${originalSize} → ${newSize} bytes)`);
            } catch (err) {
                console.error(`    ❌ Error minifying ${file}:`, err.message);
            }
        }
    }

    // Also minify files in js/ directory
    console.log('\n📜 Minifying JavaScript files in js/ directory...');
    const jsDir = path.join(__dirname, 'js');
    if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
        for (const file of jsFiles) {
            if (EXCLUDE.includes(file)) continue;
            const filePath = path.join(jsDir, file);
            backup(filePath);
            console.log(`  - js/${file}`);
            try {
                const minified = await minifyJS(filePath);
                fs.writeFileSync(filePath, minified);
                const originalSize = fs.statSync(path.join(backupDir, file)).size;
                const newSize = fs.statSync(filePath).size;
                const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
                console.log(`    ✅ Reduced by ${savings}% (${originalSize} → ${newSize} bytes)`);
            } catch (err) {
                console.error(`    ❌ Error minifying js/${file}:`, err.message);
            }
        }
    }

    console.log('\n✨ Build complete!');
    console.log(`📁 Backups saved to: ${backupDir}`);
    console.log('\n⚠️  To restore original files, run: node restore.js\n');
})();
