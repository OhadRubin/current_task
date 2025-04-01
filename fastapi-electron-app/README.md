# FastAPI Electron App

This application wraps a FastAPI server in an Electron desktop application, providing a native-like experience for users.

## Features

- Native macOS integration with menu bar
- Start/stop controls for the FastAPI server
- Self-contained application bundle
- Easy distribution

## Development

### Prerequisites

- Node.js and npm
- Python 3.7+
- PyInstaller

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the application in development mode:
   ```
   npm start
   ```

### Building

To create a distributable package:

```
npm run dist
```

This will:
1. Build the FastAPI server with PyInstaller
2. Package everything into an Electron app
3. Create a distributable in the `dist` folder

## Usage

After installation:

1. Launch the application
2. The FastAPI server will start automatically
3. Access the server interface through the application window
4. Use the tray icon to control the server (start/stop/quit)

## Notes

- The FastAPI server runs on port 8001 by default
- Logs from the server are captured in the Electron app's console 