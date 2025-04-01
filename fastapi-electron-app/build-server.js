const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the backend directory - relative to current directory, not parent
const backendDir = path.join(__dirname, '../backend');
const distDir = path.join(backendDir, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building FastAPI server with PyInstaller...');
console.log(`Backend directory: ${backendDir}`);

try {
  // Install PyInstaller if not already installed
  execSync('pip install pyinstaller', { stdio: 'inherit' });
  
  // Install FastAPI dependencies
  execSync(`pip install -r ${path.join(backendDir, 'requirements.server.txt')}`, { stdio: 'inherit' });
  
  // Build with PyInstaller
  execSync(
    `pyinstaller --onefile --name=server ${path.join(backendDir, 'server.py')}`,
    { 
      stdio: 'inherit',
      cwd: backendDir 
    }
  );
  
  console.log('FastAPI server built successfully!');
} catch (error) {
  console.error('Failed to build FastAPI server:', error.message);
  process.exit(1);
} 