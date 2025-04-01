# Tasks API - macOS Installation Guide

This guide explains how to package the Tasks API server as a macOS application with menu bar controls.

## Prerequisites

- PyInstaller
- xbar (formerly BitBar)

## Step 1: Install Required Tools

```bash
# Install PyInstaller
pip install pyinstaller


```

### Install xbar
download xbar from from: https://github.com/matryer/xbar/releases

## Step 2: Package the Application

```bash
# Navigate to the src directory
cd src

# Create the executable using the spec file
pyinstaller tasks_api.spec
```

This will create a standalone executable at `dist/tasks_api`.

## Step 3: Install the Application

```bash
# Create an Applications directory if it doesn't exist
mkdir -p ~/Applications

# Copy the executable to your Applications folder
cp dist/tasks_api ~/Applications/
```

## Step 4: Set Up the Menu Bar Control

```bash
# Make the xbar plugin executable
chmod +x tasks_api.1m.sh

# Copy the plugin to xbar's plugins directory
cp tasks_api.1m.sh ~/Library/Application\ Support/xbar/plugins/
```

## Step 5: Start Using the Application

1. Launch xbar from your Applications folder
2. Click the xbar icon in your menu bar
3. You should see "🛑 Tasks API" - click "Start Server" to launch
4. The icon will change to "🚀 Tasks API" when running
5. You can now access your API at http://localhost:8001

## Troubleshooting

- If the server doesn't start, check the paths in the xbar plugin
- You may need to adjust permissions with `chmod +x ~/Applications/tasks_api`
- To reset, run `pkill -f tasks_api` to stop any running instances 



Let me help you install the Tasks API application. I'll guide you through the steps in the installation guide.

Ran tool
I can see all the necessary files. Let's proceed with the installation steps:

```bash
cd src && pyinstaller tasks_api.spec
```
Now let's create the Applications directory (if it doesn't exist) and copy the executable:

```bash
mkdir -p ~/Applications && cp -r dist/tasks_api ~/Applications/
```
Now let's set up the menu bar control by making the xbar plugin executable and copying it to the correct location:

```bash
chmod +x tasks_api.1m.sh && mkdir -p ~/Library/Application\ Support/xbar/plugins/ && cp tasks_api.1m.sh ~/Library/Application\ Support/xbar/plugins/
```
The Tasks API has been successfully installed! Here's a summary of what was done:

1. Package built with PyInstaller
2. Application copied to ~/Applications/
3. Menu bar control script made executable and installed

To start using the application:

1. Launch xbar from your Applications folder
2. Look for the xbar icon in your menu bar
3. You'll see "🛑 Tasks API" - click "Start Server" to launch it
4. Once running, the icon will change to "🚀 Tasks API"
5. You can access the API at http://localhost:8001

If you encounter any issues:
- Make sure xbar is running
- Check permissions on ~/Applications/tasks_api with `chmod +x ~/Applications/tasks_api`
- To restart, run `pkill -f tasks_api` to stop any running instances
