# Testing in iOS Simulator

This guide explains how to test the Vue Lynx application in the iOS simulator using Lynx Explorer.

## Prerequisites

1. **macOS Required**: iOS simulator is only available on macOS.
2. **Xcode**: Make sure Xcode is installed from the Mac App Store.
3. **iOS Simulator**: Open Xcode, go to Preferences > Components and install a simulator.
4. **Lynx Explorer App**: Download and install Lynx Explorer.

### Installing Lynx Explorer

For iOS simulator:
```bash
# Download Lynx Explorer for macOS (arm64 or x86_64)
# Extract and install
mkdir -p LynxExplorer-arm64.app/
tar -zxf LynxExplorer-arm64.app.tar.gz -C LynxExplorer-arm64.app/

# Drag LynxExplorer-arm64.app into the iOS Simulator to install
```

## Running the App

### Option 1: Using Built-in Scripts

We've added convenience scripts to easily test in the iOS simulator:

```bash
# Start development server with iOS simulator
bun run dev:ios-simulator
```

This will:
1. Build the app with iOS-specific configurations
2. Start a development server on port 8081
3. Open the QR code that you can scan with Lynx Explorer

### Option 2: Manual Process

If you need more control, you can run these steps separately:

```bash
# Build for iOS platform
bun run build:ios

# Start development server for iOS
bun run dev:ios
```

Then manually open your iOS simulator with Lynx Explorer installed and scan the QR code.

## Debugging

1. You can use Safari Developer Tools to debug the JavaScript running in the simulator.
2. Open Safari > Preferences > Advanced and enable "Show Develop menu in menu bar"
3. Then choose Develop > Simulator > [Your App] to access the debugging tools

## Testing Platform-Specific Components

Our app uses a platform-detection system to load appropriate components:

- Common components from `src/components/common/` will always be used
- iOS-specific components from `src/components/ios/` will be used in the iOS simulator
- Adaptive components like `ActionButton` will automatically use the iOS version

## Troubleshooting

If you encounter issues:

1. **App doesn't appear in simulator**: Make sure the simulator is fully loaded before running the app
2. **Components not rendering**: Check console logs for errors in component loading
3. **Platform detection not working**: Verify that `window.__LYNX__.platform` is correctly detecting 'ios'
4. **QR code scanning issues**: Ensure you're using the latest version of Lynx Explorer

For more details on our cross-platform architecture, see [cross-platform-details.md](cross-platform-details.md). 
