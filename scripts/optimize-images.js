const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: 'public',
  outputDir: 'public',
  quality: 80,
  formats: ['webp', 'avif'],
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
  },
  skipExisting: true,
};

// Get all image files recursively
function getImageFiles(dir, extensions = ['.jpg', '.jpeg', '.png', '.gif']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (extensions.some(ext => item.toLowerCase().endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Optimize a single image
async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { width, height, quality = config.quality, format = 'webp' } = options;
    
    let pipeline = sharp(inputPath);
    
    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    // Convert to specified format
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, progressive: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality });
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save optimized image
    await pipeline.toFile(outputPath);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    
    return {
      originalSize,
      optimizedSize,
      savings: parseFloat(savings),
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

// Process all images
async function processImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(config.inputDir, imagePath);
    const baseName = path.basename(imagePath, path.extname(imagePath));
    const dirName = path.dirname(imagePath);
    
    // Skip if already optimized and skipExisting is true
    if (config.skipExisting) {
      const webpPath = path.join(dirName, `${baseName}.webp`);
      if (fs.existsSync(webpPath)) {
        console.log(`⏭️  Skipping ${relativePath} (already optimized)`);
        skippedCount++;
        continue;
      }
    }
    
    // Process each format
    for (const format of config.formats) {
      const outputPath = path.join(dirName, `${baseName}.${format}`);
      
      const result = await optimizeImage(imagePath, outputPath, {
        format,
        quality: config.quality,
      });
      
      if (result) {
        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;
        processedCount++;
      }
    }
  }
  
  // Summary
  console.log('\n📊 Optimization Summary:');
  console.log(`Processed: ${processedCount} images`);
  console.log(`Skipped: ${skippedCount} images`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  
  // Generate responsive images for hero and important images
  console.log('\n🖼️  Generating responsive images...');
  await generateResponsiveImages();
}

// Generate responsive images for important sections
async function generateResponsiveImages() {
  const importantImages = [
    'public/hero/hero-image.webp',
    'public/company-logos/flex-pro.webp',
    'public/company-logos/secrtary.webp',
    'public/company-logos/farm-house.webp',
    'public/company-logos/skinverse.webp',
  ];
  
  for (const imagePath of importantImages) {
    if (!fs.existsSync(imagePath)) continue;
    
    const baseName = path.basename(imagePath, path.extname(imagePath));
    const dirName = path.dirname(imagePath);
    
    // Generate different sizes
    for (const [sizeName, size] of Object.entries(config.sizes)) {
      const outputPath = path.join(dirName, `${baseName}-${sizeName}.webp`);
      
      await optimizeImage(imagePath, outputPath, {
        width: size,
        format: 'webp',
        quality: config.quality,
      });
    }
  }
}

// Create a picture element component for responsive images
function generatePictureComponent(imagePath, alt, className = '') {
  const baseName = path.basename(imagePath, path.extname(imagePath));
  const dirName = path.dirname(imagePath);
  
  return `
<picture class="${className}">
  <source
    srcset="${dirName}/${baseName}-large.webp"
    media="(min-width: 1024px)"
  />
  <source
    srcset="${dirName}/${baseName}-medium.webp"
    media="(min-width: 768px)"
  />
  <source
    srcset="${dirName}/${baseName}-small.webp"
    media="(min-width: 480px)"
  />
  <img
    src="${dirName}/${baseName}-thumbnail.webp"
    alt="${alt}"
    loading="lazy"
    decoding="async"
  />
</picture>`;
}

// Run the optimization
if (require.main === module) {
  processImages().catch(console.error);
}

module.exports = {
  processImages,
  generatePictureComponent,
  optimizeImage,
};
