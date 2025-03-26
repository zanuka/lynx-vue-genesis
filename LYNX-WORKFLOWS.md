# Lynx Development Workflows

This project supports development with Lynx, which allows your Vue components to run natively on mobile devices.

## Available Scripts

### Web Development

```bash
# Run the Lynx web simulator
bun run dev:lynx
```

This will start a Vite development server and open `lynx.html` in your browser. The Lynx web simulator allows you to test your Lynx components in a browser environment.

### iOS Development

```bash
# Run the iOS development server with QR code generation
bun run dev:ios-qr
```

This will:
1. Build the necessary loaders
2. Start the rspeedy development server for iOS
3. Generate a QR code that you can scan with a Lynx-compatible device
4. Keep the server running in hot-reload mode

The terminal will display a URL like:
```
http://192.168.x.x:3000/main.lynx.bundle?fullscreen=true
```

You can scan this QR code with a Lynx-compatible device or paste it into the iOS simulator.

### iOS Simulator Development

```bash
# Run the iOS simulator with QR code generation
bun run dev:ios-simulator
```

This will:
1. Build the necessary loaders
2. Start the rspeedy development server for iOS
3. Open the iOS simulator
4. Generate a QR code URL that you can copy and paste into the simulator
5. Keep the server running in hot-reload mode

### Android Development

```bash
# Run the Android development server
bun run dev:android
```

This will build the loaders and start the rspeedy development server for Android.

## Building for Production

```bash
# Build for iOS
bun run build:ios

# Build for Android
bun run build:android
```

These commands will build your application for production deployment on iOS and Android respectively.

## Project Structure

- `src/lynx-main.ts` - Main thread entry point for the Lynx application
- `src/lynx-worker.ts` - Worker thread entry point for business logic
- `src/components/common/` - Shared components that work across platforms
- `src/components/ios/` - iOS-specific components
- `src/components/android/` - Android-specific components
- `lynx.ios.config.ts` - Configuration for iOS builds
- `lynx.android.config.ts` - Configuration for Android builds

## Multi-Threaded Architecture

Lynx uses a dual-thread architecture:
- Main thread (`lynx-main.ts`): Handles UI/DOM operations
- Worker thread (`lynx-worker.ts`): Handles business logic and state management

This separation allows for smooth UI rendering while processing intensive operations in the background.

## Custom Elements

Lynx uses custom elements like `<view>` and `<text>` instead of standard HTML elements. These are mapped to native components on mobile platforms. 
