# Cross-Platform Architecture for Vue Lynx

This project supports multiple platforms from a single codebase:

- **Web** (default)
- **iOS**
- **Android**

## Quick Start

### Running on different platforms

```bash
# Web
bun run dev

# iOS
bun run dev:ios
bun run dev:ios-simulator  # Opens QR code for iOS simulator

# Android
bun run dev:android
```

### Building for production

```bash
# Web
bun run build

# iOS
bun run build:ios

# Android
bun run build:android
```

## Testing on Mobile Platforms

For detailed instructions on testing on mobile platforms:

- [iOS Testing Guide](ios-simulator-testing.md) - How to test your app on iOS devices and simulators
- [Android Testing Guide](android-testing.md) - How to test your app on Android devices and emulators

Both platforms use Lynx Explorer for previewing your app by scanning a QR code.

## Entry Points

- `src/main.lynx` - Entry point for web
- `src/mobile.lynx` - Entry point for iOS and Android

## Component Architecture

We've implemented a flexible component architecture that allows sharing code across platforms while still enabling platform-specific optimizations when needed.

### Directory Structure

Components are organized into platform-specific directories:

```
src/components/
├── common/     # Components shared across all platforms
├── ios/        # iOS-specific components
├── android/    # Android-specific components
└── web/        # Web-specific components
```

### Component Types

#### Common Components

Components in the `common/` directory work universally across all platforms. These components:
- Use only cross-platform compatible features and styling
- Have consistent behavior regardless of platform
- Example: `LynxHelloWorld.vue`

#### Platform-Specific Components

Components in the platform-specific directories (`ios/`, `android/`, `web/`) include:
- Platform-optimized styling (shadows, animations, etc.)
- Platform-specific interaction patterns
- Platform-specific features (like iOS-style buttons)
- Examples: `iOSActionButton.vue`, `AndroidActionButton.vue`, `WebActionButton.vue`

#### Adaptive Components

Components that adapt to the current platform (like `ActionButton.vue`) detect the platform at runtime and render the appropriate implementation:

```vue
<template>
  <view>
    <AndroidActionButton v-if="isAndroid" :label="label" :onPress="onPress" />
    <iOSActionButton v-else-if="isIOS" :label="label" :onPress="onPress" />
    <WebActionButton v-else :label="label" :onPress="onPress" />
  </view>
</template>
```

## Platform Detection

The application automatically detects which platform it's running on and loads the appropriate components. This happens in `src/components/index.ts`:

```typescript
// Determine platform and select components
if (window.__LYNX__?.platform === 'ios') {
  platformExports = ios;
} else if (window.__LYNX__?.platform === 'android') {
  platformExports = android;
} else {
  platformExports = web;
}
```

## Usage Example

Import components from the main components module to automatically get the right platform-specific versions:

```javascript
import components from './components';

const { 
  LynxHelloWorld,  // Common component available everywhere
  ActionButton,    // Platform-adaptive component 
  iOSActionButton  // Platform-specific (only functional on iOS)
} = components;
```

## Best Practices

1. Start with common components whenever possible
2. Create platform-specific versions only when necessary for UX or performance
3. Use adaptive components to abstract platform differences from your application code
4. Keep platform-specific styling in the respective component files
5. Test each implementation on its target platform

## Next Steps

1. Run the app on different platforms to test the platform-specific components
2. Add more common components to the `common/` directory
3. Implement platform-specific features when needed 
