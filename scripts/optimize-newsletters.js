#!/usr/bin/env node

/**
 * Script to optimize newsletter SVGs
 * Options:
 * 1. Convert to PNG/WebP for smaller file sizes
 * 2. Generate thumbnails for listing pages
 * 3. Keep originals for full-size viewing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INPUT_DIR = path.join(__dirname, '../public/NewsletterSvg');
const OUTPUT_DIR = path.join(__dirname, '../public/newsletter-images');
const THUMBNAIL_DIR = path.join(OUTPUT_DIR, 'thumbnails');

// Create output directories
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

console.log('🎨 Newsletter Image Optimization Script');
console.log('=====================================');

// Check if ImageMagick is installed
try {
  execSync('convert -version', { stdio: 'ignore' });
  console.log('✅ ImageMagick detected');
} catch (error) {
  console.error('❌ ImageMagick not found. Please install it:');
  console.error('   macOS: brew install imagemagick');
  console.error('   Ubuntu: sudo apt-get install imagemagick');
  console.error('   Windows: Download from https://imagemagick.org/script/download.php');
  process.exit(1);
}

// Get all SVG files
const svgFiles = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.svg'));
console.log(`\n📁 Found ${svgFiles.length} SVG files to optimize\n`);

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

svgFiles.forEach((file, index) => {
  const inputPath = path.join(INPUT_DIR, file);
  const baseName = path.basename(file, '.svg');
  const pngPath = path.join(OUTPUT_DIR, `${baseName}.png`);
  const thumbnailPath = path.join(THUMBNAIL_DIR, `${baseName}.png`);
  
  // Get original file size
  const stats = fs.statSync(inputPath);
  const originalSizeMB = (stats.size / 1024 / 1024).toFixed(2);
  totalOriginalSize += stats.size;
  
  console.log(`Processing ${index + 1}/${svgFiles.length}: ${file} (${originalSizeMB} MB)`);
  
  try {
    // Convert SVG to PNG (full size, but with compression)
    console.log('  📸 Converting to PNG...');
    execSync(`convert -density 150 "${inputPath}" -quality 85 "${pngPath}"`, { stdio: 'ignore' });
    
    // Create thumbnail (small size for grid view)
    console.log('  🖼️  Creating thumbnail...');
    execSync(`convert "${pngPath}" -resize 400x600 -quality 80 "${thumbnailPath}"`, { stdio: 'ignore' });
    
    // Get optimized file size
    const pngStats = fs.statSync(pngPath);
    const optimizedSizeMB = (pngStats.size / 1024 / 1024).toFixed(2);
    totalOptimizedSize += pngStats.size;
    
    const reduction = ((1 - pngStats.size / stats.size) * 100).toFixed(1);
    console.log(`  ✅ Optimized: ${originalSizeMB} MB → ${optimizedSizeMB} MB (${reduction}% reduction)\n`);
    
  } catch (error) {
    console.error(`  ❌ Error processing ${file}: ${error.message}\n`);
  }
});

// Summary
console.log('=====================================');
console.log('📊 Optimization Summary:');
console.log(`   Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Optimized total: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Total reduction: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
console.log('\n✨ Optimization complete!');
console.log('\nNext steps:');
console.log('1. Update newsletter-data.ts to use /newsletter-images/ instead of /NewsletterSvg/');
console.log('2. Use thumbnails for grid views: /newsletter-images/thumbnails/');
console.log('3. Consider removing original SVGs from git to reduce repo size');