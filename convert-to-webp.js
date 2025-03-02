const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories to process
const directories = [
  'public/company-logos',
  'public/Ready-made-solutions',
  'public/solutions',
  'public/hero',
  'public/patterns',
  'public/projects',
  'public/icons'
];

// File extensions to convert
const extensions = ['.png', '.jpg', '.jpeg', '.svg'];

// Function to convert a file to WebP
async function convertToWebP(filePath) {
  const fileInfo = path.parse(filePath);
  
  // Skip if it's already a WebP file
  if (fileInfo.ext.toLowerCase() === '.webp') return;
  
  // Only process specified extensions
  if (!extensions.includes(fileInfo.ext.toLowerCase())) return;
  
  const outputPath = path.join(fileInfo.dir, `${fileInfo.name}.webp`);
  
  console.log(`Converting ${filePath} to WebP...`);
  
  try {
    if (fileInfo.ext.toLowerCase() === '.svg') {
      // For SVG files, we need to convert differently
      await sharp(filePath, { density: 300 })
        .webp({ quality: 80 })
        .toFile(outputPath);
    } else {
      // For PNG, JPG, JPEG
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(outputPath);
    }
    console.log(`Successfully converted to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

// Function to process a directory recursively
async function processDirectory(directory) {
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await convertToWebP(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('Starting image conversion to WebP...');
  
  // Process each directory
  for (const directory of directories) {
    try {
      if (fs.existsSync(directory)) {
        console.log(`Processing directory: ${directory}`);
        await processDirectory(directory);
      } else {
        console.log(`Directory not found: ${directory}`);
      }
    } catch (error) {
      console.error(`Error processing ${directory}:`, error.message);
    }
  }
  
  console.log('Conversion complete!');
}

// Run the script
main().catch(error => {
  console.error('An error occurred:', error);
}); 