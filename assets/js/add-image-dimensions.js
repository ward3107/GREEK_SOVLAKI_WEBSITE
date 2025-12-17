// Script to add width and height attributes to all gallery images
// Run with: node add-image-dimensions.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imageDimensions = {
  'gallery-1.webp': { width: 800, height: 1732 },
  'gallery-2.webp': { width: 800, height: 1732 },
  'gallery-3.webp': { width: 800, height: 369 },
  'gallery-4.webp': { width: 800, height: 1732 },
  'gallery-5.webp': { width: 800, height: 369 },
  'gallery-6.webp': { width: 800, height: 1732 },
  'gallery-7.webp': { width: 800, height: 369 },
  'gallery-8.webp': { width: 800, height: 369 },
  'gallery-9.webp': { width: 800, height: 1732 },
  // Add more as needed - run `file images/*.webp` to get dimensions
};

// Function to get image dimensions from file command
function getImageDimensions(imagePath) {
  try {
    const output = execSync(`file "${imagePath}"`).toString();
    const match = output.match(/(\d+)x(\d+)/);
    if (match) {
      return { width: parseInt(match[1]), height: parseInt(match[2]) };
    }
  } catch (error) {
    console.error(`Error getting dimensions for ${imagePath}:`, error.message);
  }
  return null;
}

// Get all image dimensions from the images folder
function getAllImageDimensions() {
  const imagesDir = path.join(__dirname, 'images');
  const files = fs.readdirSync(imagesDir);
  const dimensions = {};

  files.forEach(file => {
    if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')) {
      const dims = getImageDimensions(path.join(imagesDir, file));
      if (dims) {
        dimensions[file] = dims;
      }
    }
  });

  return dimensions;
}

console.log('Scanning image dimensions...');
const allDimensions = getAllImageDimensions();
console.log('\nFound dimensions for', Object.keys(allDimensions).length, 'images');
console.log('\nImage dimensions:');
console.log(JSON.stringify(allDimensions, null, 2));

// Optionally save to a JSON file
fs.writeFileSync(
  path.join(__dirname, 'image-dimensions.json'),
  JSON.stringify(allDimensions, null, 2)
);
console.log('\nDimensions saved to image-dimensions.json');
