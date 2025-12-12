const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

async function convertToWebP() {
    const files = fs.readdirSync(imagesDir);
    const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

    console.log(`Found ${jpgFiles.length} JPG images to convert...\n`);

    let converted = 0;
    let totalSaved = 0;

    for (const file of jpgFiles) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(imagesDir, file.replace(/\.jpe?g$/i, '.webp'));

        try {
            const inputStats = fs.statSync(inputPath);
            const inputSize = inputStats.size;

            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSize = outputStats.size;
            const saved = inputSize - outputSize;
            const percent = ((saved / inputSize) * 100).toFixed(1);

            totalSaved += saved;
            converted++;

            console.log(`✓ ${file} → ${file.replace(/\.jpe?g$/i, '.webp')} (${percent}% smaller)`);
        } catch (err) {
            console.log(`✗ ${file} - Error: ${err.message}`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Converted: ${converted}/${jpgFiles.length} images`);
    console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
    console.log(`========================================`);
}

convertToWebP();
