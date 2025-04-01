const { app, Menu, Tray, nativeImage, dialog, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const fs = require('fs');

let tray = null;
let serverProcess = null;
let mainWindow = null;
let serverRunning = false;

// Get the path to the packaged FastAPI executable
function getServerPath() {
  if (isDev) {
    // In development, use the backend server directly
    return path.join(__dirname, '../backend/server.py');
  } else {
    // In production, use the packaged executable
    return path.join(process.resourcesPath, 'backend', 'server');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png')
  });

  // Load the FastAPI server URL
  mainWindow.loadURL('http://localhost:8001');

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  if (serverRunning) return;

  const serverPath = getServerPath();
  console.log(`Starting server from: ${serverPath}`);

  try {
    if (isDev) {
      // In development, run with Python
      serverProcess = spawn('python', [serverPath]);
    } else {
      // In production, run the executable directly
      serverProcess = spawn(serverPath);
    }

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server stdout: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server stderr: ${data}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      serverRunning = false;
      updateTrayMenu();
      
      if (code !== 0 && code !== null) {
        dialog.showErrorBox('Server Error', 
          `The FastAPI server crashed with code ${code}. Check the logs for details.`);
      }
    });

    serverRunning = true;
    updateTrayMenu();
    
    // Wait a bit for the server to start before opening the window
    setTimeout(() => {
      if (!mainWindow) {
        createWindow();
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to start server:', error);
    dialog.showErrorBox('Server Error', 
      `Failed to start the FastAPI server: ${error.message}`);
  }
}

function stopServer() {
  if (!serverRunning || !serverProcess) return;

  console.log('Stopping server...');
  
  // On Windows, you might need a different approach
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
  } else {
    serverProcess.kill();
  }
  
  serverProcess = null;
  serverRunning = false;
  updateTrayMenu();
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: serverRunning ? 'Stop Server' : 'Start Server', 
      click: serverRunning ? stopServer : startServer 
    },
    { type: 'separator' },
    { 
      label: 'Open Interface', 
      click: () => {
        if (serverRunning) {
          if (mainWindow) {
            mainWindow.show();
          } else {
            createWindow();
          }
        } else {
          dialog.showMessageBox({
            type: 'info',
            title: 'Server Not Running',
            message: 'The server is not running. Please start the server first.',
            buttons: ['Start Server', 'Cancel'],
          }).then(result => {
            if (result.response === 0) {
              startServer();
            }
          });
        }
      },
      enabled: serverRunning
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  
  // Update tray icon or tooltip based on server status
  tray.setToolTip(`FastAPI Server ${serverRunning ? '(Running)' : '(Stopped)'}`);
}

app.whenReady().then(() => {
  // Create tray icon
  const iconPath = path.join(__dirname, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    // Create a default icon if none exists
    const defaultIconPath = path.join(__dirname, 'icon.png');
    fs.writeFileSync(defaultIconPath, '');
  }
  
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  
  updateTrayMenu();
  
  // Auto-start server when app launches
  startServer();
});

// Prevent the app from closing when all windows are closed
app.on('window-all-closed', (e) => {
  if (process.platform !== 'darwin') {
    e.preventDefault();
  }
});

app.on('activate', () => {
  if (mainWindow === null && serverRunning) {
    createWindow();
  }
});

// Make sure to stop the server before quitting
app.on('before-quit', () => {
  stopServer();
}); 