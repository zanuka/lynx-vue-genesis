# Testing on Android

This guide explains how to test the Vue Lynx application on Android devices or emulators using Lynx Explorer.

## Prerequisites

1. **Android Development Setup**: You need either:
   - An Android device with USB debugging enabled
   - Android Emulator (via Android Studio)
2. **Android SDK**: Make sure you have Android SDK installed
3. **Lynx Explorer App**: Download and install the Lynx Explorer APK

### Installing Lynx Explorer

For Android devices or emulators:
```bash
# Download Lynx Explorer APK from the official website
# Install it on your device:
adb install LynxExplorer.apk

# Or you can download and install it directly on your device
```

## Running the App

### Option 1: Using Built-in Scripts

We've added convenience scripts to easily test on Android:

```bash
# Start development server with Android configuration
bun run dev:android
```

This will:
1. Build the app with Android-specific configurations
2. Start a development server on port 8082
3. Display a QR code that you can scan with the Lynx Explorer app

### Option 2: Manual Process

If you need more control, you can run these steps separately:

```bash
# Build for Android platform
bun run build:android

# Start development server for Android
bun run dev:android
```

Then manually open Lynx Explorer on your Android device and scan the QR code.

## Debugging

1. Use Chrome Developer Tools for debugging:
   - Open Chrome and navigate to `chrome://inspect`
   - Find your device/emulator under "Remote Target"
   - Click "inspect" to open DevTools
2. Alternatively, use Lynx DevTool if available

## Testing Platform-Specific Components

Our app uses a platform-detection system to load appropriate components:

- Common components from `src/components/common/` will always be used
- Android-specific components from `src/components/android/` will be used on Android
- Adaptive components like `ActionButton` will automatically use the Android version

## Troubleshooting

If you encounter issues:

1. **App doesn't appear**: Make sure Lynx Explorer is installed correctly
2. **Components not rendering**: Check console logs for errors in component loading
3. **Platform detection not working**: Verify that `window.__LYNX__.platform` is correctly detecting 'android'
4. **USB Debugging issues**: Ensure USB debugging is enabled in Developer Options
5. **QR code scanning issues**: Ensure you're using the latest version of Lynx Explorer

For more details on our cross-platform architecture, see [cross-platform-details.md](cross-platform-details.md). 
