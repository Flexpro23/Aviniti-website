const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed, and install it if not
try {
  require.resolve('sharp');
  console.log('Sharp is already installed.');
} catch (e) {
  console.log('Installing sharp...');
  execSync('npm install sharp');
}

const sharp = require('sharp');

// Directory containing the images
const solutionsDir = path.join(__dirname, 'public', 'Ready-made-solutions');

// List of files that need to be converted
const filesToConvert = [
  'Delivery App Solution.svg',
  'Gym Management App Solutions.svg'
];

async function convertToWebP() {
  console.log('Converting SVG files to WebP...');
  
  for (const file of filesToConvert) {
    const inputPath = path.join(solutionsDir, file);
    const outputPath = path.join(solutionsDir, file.replace('.svg', '.webp'));
    
    console.log(`Converting ${inputPath} to ${outputPath}`);
    
    try {
      // Check if the input file exists
      if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        continue;
      }
      
      // Convert SVG to WebP with sharp
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Successfully converted ${file} to WebP`);
    } catch (error) {
      console.error(`Error converting ${file}:`, error);
    }
  }
  
  console.log('Conversion completed!');
}

convertToWebP(); 