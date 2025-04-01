# FastAPI Electron App - Build Guide

This guide walks through the process of building and packaging the FastAPI Electron app for distribution.

## Prerequisites

- Node.js (v14+) and npm
- Python 3.7+
- Git

## Development Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fastapi-electron-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm start
   ```

   This starts the Electron app and launches the FastAPI server directly from Python.

## Building for Distribution

### Step 1: Prepare Backend

The build process will automatically:
- Install PyInstaller if not already installed
- Install FastAPI dependencies
- Package the FastAPI server using PyInstaller

You can manually trigger this step with:
```bash
npm run build-server
```

This creates an executable in `backend/dist/`.

### Step 2: Package with Electron Builder

To package the entire application with Electron Builder:

```bash
npm run dist
```

This will:
1. Build the FastAPI server (if not already built)
2. Package everything into an Electron app
3. Create platform-specific distributables in the `dist` folder

### Platform-Specific Builds

#### macOS

```bash
npm run dist -- --mac
```

This produces:
- `.dmg` installer
- `.zip` archive with the `.app` bundle

#### Windows

```bash
npm run dist -- --win
```

This produces:
- `.exe` installer
- Unpacked application in `dist/win-unpacked/`

#### Linux

```bash
npm run dist -- --linux
```

This produces:
- `.AppImage` file
- `.deb` package (Debian/Ubuntu)
- `.rpm` package (Fedora/RHEL)

## Customization Options

### Application Icon

Replace `icon.png` with your custom icon. For best results:
- Use a 1024x1024 PNG image
- For platform-specific icons, see Electron Builder documentation

### Package Metadata

Edit `package.json` to customize:
- Application name and description
- Version number
- Author information
- Copyright details

### Build Configuration

The build configuration in `package.json` can be modified to:
- Change application ID
- Adjust macOS category
- Modify file inclusion/exclusion patterns
- Add signing certificates for distribution

## Troubleshooting

### Common Issues

1. **PyInstaller not found**
   ```bash
   pip install pyinstaller
   ```

2. **FastAPI dependencies missing**
   ```bash
   pip install -r ../backend/requirements.server.txt
   ```

3. **Electron packaging errors**
   - Check that Node.js and npm are up to date
   - Clear npm cache: `npm cache clean --force`
   - Remove node_modules and reinstall: `rm -rf node_modules && npm install`

### Packaging Logs

Examine the build logs for detailed error messages:
- Backend build: Check console output from `build-server.js`
- Electron packaging: Check `electron-builder.yml` logs

## Distribution

After building, you can distribute your application:

1. For macOS: Upload `.dmg` or `.zip` to your website or app store
2. For Windows: Distribute the `.exe` installer
3. For Linux: Provide `.AppImage`, `.deb`, or `.rpm` packages

## Further Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [PyInstaller Documentation](https://pyinstaller.org/en/stable/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/) 