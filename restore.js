#!/usr/bin/env node

/**
 * Restore script - Restores original files from backup
 */

const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '.backup');

if (!fs.existsSync(backupDir)) {
    console.log('❌ No backup directory found.');
    process.exit(1);
}

console.log('🔄 Restoring files from backup...\n');

const files = fs.readdirSync(backupDir);
let restored = 0;

files.forEach(file => {
    const backupPath = path.join(backupDir, file);
    const targetPath = path.join(__dirname, file);
    const stats = fs.statSync(backupPath);

    if (stats.isFile()) {
        fs.copyFileSync(backupPath, targetPath);
        console.log(`  ✅ Restored: ${file}`);
        restored++;
    }
});

console.log(`\n✨ Restored ${restored} file(s)!`);
console.log('\n💡 Tip: Delete the .backup directory if you don\'t need it anymore\n');
