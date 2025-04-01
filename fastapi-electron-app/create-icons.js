const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Icon Generator Script');
console.log('---------------------');
console.log('This script helps generate icons for your Electron app.');
console.log('You\'ll need to have ImageMagick installed for this to work.');
console.log();

// Check if ImageMagick is installed
try {
  execSync('convert -version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: ImageMagick is not installed or not in PATH.');
  console.log('Please install ImageMagick:');
  console.log('  - macOS: brew install imagemagick');
  console.log('  - Linux: sudo apt-get install imagemagick');
  console.log('  - Windows: https://imagemagick.org/script/download.php');
  process.exit(1);
}

// Source image path
const sourceImage = path.join(__dirname, 'source-icon.png');

if (!fs.existsSync(sourceImage)) {
  console.log('Source icon not found. Creating a placeholder...');
  
  // Create directories for icons
  const dirs = [
    path.join(__dirname, 'build'),
    path.join(__dirname, 'build', 'icons')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate a placeholder source icon (blue square with white "F" for FastAPI)
  try {
    execSync(`convert -size 1024x1024 xc:blue -fill white -pointsize 600 -gravity center -draw "text 0,0 'F'" ${sourceImage}`);
    console.log(`Created placeholder icon at ${sourceImage}`);
  } catch (error) {
    console.error('Error creating placeholder icon:', error.message);
    process.exit(1);
  }
}

// Generate icons for different platforms
const iconSizes = {
  mac: [16, 32, 64, 128, 256, 512, 1024],
  win: [16, 32, 48, 64, 128, 256],
  linux: [16, 32, 48, 64, 128, 256, 512]
};

// Create build/icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'build', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate macOS icns file
console.log('Generating macOS icon (icns)...');
try {
  // Create iconset directory
  const iconsetDir = path.join(iconsDir, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
  }
  
  // Generate different size icons for macOS
  iconSizes.mac.forEach(size => {
    execSync(`convert ${sourceImage} -resize ${size}x${size} ${path.join(iconsetDir, `icon_${size}x${size}.png`)}`);
    execSync(`convert ${sourceImage} -resize ${size*2}x${size*2} ${path.join(iconsetDir, `icon_${size}x${size}@2x.png`)}`);
  });
  
  // Create icns file if on macOS
  if (process.platform === 'darwin') {
    execSync(`iconutil -c icns ${iconsetDir} -o ${path.join(iconsDir, 'icon.icns')}`);
  } else {
    console.log('Not on macOS, skipping icns generation (iconutil not available)');
  }
  
  console.log('Generated macOS iconset');
} catch (error) {
  console.error('Error generating macOS icons:', error.message);
}

// Generate Windows ico file
console.log('Generating Windows icon (ico)...');
try {
  // Generate different size icons for Windows
  const winIconPaths = iconSizes.win.map(size => {
    const iconPath = path.join(iconsDir, `icon-${size}.png`);
    execSync(`convert ${sourceImage} -resize ${size}x${size} ${iconPath}`);
    return iconPath;
  });
  
  // Create ico file
  execSync(`convert ${winIconPaths.join(' ')} ${path.join(iconsDir, 'icon.ico')}`);
  console.log('Generated Windows icon');
} catch (error) {
  console.error('Error generating Windows icon:', error.message);
}

// Generate Linux png icons
console.log('Generating Linux icons (png)...');
try {
  iconSizes.linux.forEach(size => {
    execSync(`convert ${sourceImage} -resize ${size}x${size} ${path.join(iconsDir, `${size}x${size}.png`)}`);
  });
  console.log('Generated Linux icons');
} catch (error) {
  console.error('Error generating Linux icons:', error.message);
}

// Copy main icon to project root
console.log('Copying main icon to project root...');
try {
  execSync(`convert ${sourceImage} -resize 256x256 ${path.join(__dirname, 'icon.png')}`);
  console.log('Copied main icon to project root');
} catch (error) {
  console.error('Error copying main icon:', error.message);
}

console.log('\nIcon generation complete!');
console.log('The following icons were generated:');
console.log('- macOS: build/icons/icon.icns (if on macOS) and build/icons/icon.iconset/*');
console.log('- Windows: build/icons/icon.ico');
console.log('- Linux: build/icons/*.png');
console.log('- General: icon.png (in project root)');
console.log();
console.log('To use your own icon:');
console.log('1. Replace source-icon.png with your own 1024x1024 PNG image');
console.log('2. Run this script again');
console.log(); 