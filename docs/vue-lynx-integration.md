# Vue-Lynx Integration

This document outlines our strategy for integrating Vue.js with Lynx for mobile app development on iOS and Android platforms.

## Overview

The Vue-Lynx integration provides a way to use Vue.js as the UI framework for Lynx-based mobile applications. This integration allows developers to leverage Vue's reactivity system, component architecture, and ecosystem while deploying to native mobile platforms through Lynx.

## Architecture

The integration consists of several key components:

1. **Vue Webpack Plugin** - A webpack plugin that enables Vue integration with Lynx's template plugin.
2. **Vue-Lynx rspeedy Plugin** - A plugin for rspeedy that handles the integration of Vue with Lynx's build system.
3. **Thread-Specific Loaders** - Dedicated loaders for main thread and background thread code.
4. **Runtime Adapter** - A module that adapts Vue's DOM operations to use Lynx's Element PAPI.
5. **Thread Communication** - Utilities for communication between UI and background threads.
6. **Vue Plugin** - A Vue plugin that registers Lynx-specific components and functionality.
7. **Platform Detection** - Utilities for detecting and responding to the current platform.

## Implementation Details

### Step 1: Vue Webpack Plugin

The `vue-webpack-plugin.js` file provides a webpack plugin that:
- Defines layers for thread splitting (main thread vs background)
- Handles Vue-specific webpack configurations
- Adds runtime modules for Vue component evaluation
- Processes assets for the Lynx environment
- Hooks into Lynx template plugin for integration

### Step 2: Vue-Lynx rspeedy Plugin

The `vue-lynx-rspeedy-plugin.js` file is an rspeedy plugin that:
- Configures the webpack chain for Vue integration
- Sets up loaders for .vue files and thread splitting
- Adds platform-specific environments
- Configures the Vue Webpack Plugin
- Adds TypeScript and Babel support for modern Vue development

### Step 3: Thread-Specific Loaders

The thread-specific loaders handle code processing for their respective environments:

**Main Thread Loader** (`vue-lynx-main-thread.js`):
- Marks code for the main UI thread
- Transforms imports to ensure they use the correct loaders
- Adds main thread markers to the code

**Background Thread Loader** (`vue-lynx-background.js`):
- Marks code for the background thread
- Transforms imports to ensure they use the correct loaders
- Adds background thread markers to the code
- Removes UI-specific code that shouldn't run in the background

### Step 4: Runtime Adapter

The runtime adapter (`runtime/index.js`) handles the adaptation of Vue's DOM operations to Lynx's Element PAPI:
- Replaces `document.createElement` with Lynx's `__CreateElement`
- Maps Vue element types to Lynx element types
- Patches DOM methods like `appendChild` and `setAttribute`

### Step 5: Thread Communication

The thread communication module (`runtime/thread-communication.js`) provides:
- Communication channels between main and background threads
- State synchronization between threads
- Method invocation across thread boundaries
- Event notification system

### Step 6: Main Entry Point

The main entry point (`vue-lynx-entry.js`) exports:
- All necessary plugins and utilities for using Vue with Lynx
- A Vue plugin that registers Lynx-specific functionality
- Composable functions for platform detection and thread communication

## Directory Structure

The Vue-Lynx integration is organized as follows:

```
vue-lynx/
├── loaders/
│   ├── vue-webpack-plugin.js      # Webpack plugin for Vue-Lynx
│   ├── vue-lynx-rspeedy-plugin.js # rspeedy plugin for Vue-Lynx
│   ├── vue-lynx-main-thread.js    # Main thread loader
│   ├── vue-lynx-background.js     # Background thread loader
│   ├── vue-lynx-loader.js         # Vue SFC transformer
│   └── vue-lynx-thread-splitter.js # Thread splitting logic
├── runtime/
│   ├── index.js                   # Runtime adapter for Lynx
│   └── thread-communication.js    # Thread communication utilities
└── vue-lynx-entry.js              # Main entry point
```

## Usage

### Creating Vue Components for Lynx

When creating Vue components for Lynx, use standard Vue SFC syntax with these considerations:
- Use Lynx element names in templates (`view` instead of `div`, etc.)
- Use `className` instead of `class` for styling
- Platform-specific code can be conditionally included using Vue's `v-if` directives

Example:
```vue
<template>
  <view className="container">
    <text className="title">Hello Lynx</text>
    
    <view v-if="platform === 'ios'" className="ios-specific">
      <text>iOS-specific UI</text>
    </view>
    
    <view v-if="platform === 'android'" className="android-specific">
      <text>Android-specific UI</text>
    </view>
  </view>
</template>

<script>
import { useLynxPlatform } from '@lynx-js/vue-plugin';

export default {
  setup() {
    const platform = useLynxPlatform();
    return { platform };
  }
}
</script>
```

### Thread-Specific Code Organization

To optimize for the two-thread model, organize your code as follows:

1. **Components & Views**: Place in the `src/components` and `src/views` directories. These are automatically assigned to the main UI thread.

2. **Data Services & Stores**: Place in the `src/services` and `src/store` directories. These are automatically assigned to the background thread.

3. **Shared Code**: Use the thread communication utilities to pass data between threads:

```js
// In a UI component (main thread)
import { useBackgroundThread } from '@lynx-js/vue-plugin';

export default {
  setup() {
    const bg = useBackgroundThread('userService');
    
    async function fetchUserData() {
      const userData = await bg.callMethod('fetchUser', 123);
      return userData;
    }
    
    return { fetchUserData };
  }
}

// In a service (background thread)
import { useMainThread } from '@lynx-js/vue-plugin';

export function fetchUser(userId) {
  const ui = useMainThread('userService');
  
  // Perform background operations
  const userData = { /* ... */ };
  
  // Update UI
  ui.updateUI({ userData });
  
  return userData;
}
```

### Building for Different Platforms

Use the provided scripts to build for different platforms:

```bash
# For iOS
bun run build:ios

# For Android
bun run build:android

# Development mode for iOS
bun run dev:ios

# Development mode for Android
bun run dev:android
```

## Current Approach vs. Full Runtime Integration

Our current approach focuses on bundle transformation to make Vue applications compatible with the Lynx Explorer app. However, examining the official [Lynx React implementation](https://github.com/lynx-family/lynx-stack/blob/main/packages/react/runtime/src/index.ts) reveals a more sophisticated integration that we should aim for:

### Current Approach (Bundle Transformation)
- Transforms the output of rspeedy builds to include proper Lynx headers and metadata
- Adds the required JavaScript content with bundle metadata
- Creates binary bundles with the correct format for iOS/Android
- Minimal integration that allows basic Vue apps to run in Lynx Explorer

### Full Runtime Integration (Like React)
The official Lynx React implementation provides deeper integration:

1. **Framework Adaptation**: Uses Preact as its foundation, re-exporting React APIs
2. **Custom Hooks Implementation**: Custom implementations of React hooks adapted for Lynx
3. **Lazy Loading**: Special implementations for lazy loading that work across threads
4. **Threading Model**: Explicit handling of main thread vs background thread code
5. **Custom Components**: Lynx-specific components and APIs

### Roadmap to Full Vue Runtime for Lynx

To achieve parity with the React implementation, we should:

1. **Vue Core Adaptation**:
   - Create a lightweight Vue runtime that adapts Vue's rendering to Lynx
   - Implement custom renderers that target Lynx's Element PAPI instead of DOM

2. **Composition API Integration**:
   - Adapt Vue's composition API (ref, reactive, computed, etc.) to work with Lynx
   - Create Lynx-specific composables for platform features

3. **Threading Model**:
   - Implement `mainThreadLazy` and `backgroundLazy` equivalents for Vue components
   - Create a thread communication system for Vue components

4. **Custom Vue Plugin**:
   - Develop a plugin that registers Lynx-specific components and directives
   - Provide utilities for working with Lynx features from Vue components

5. **Build System Integration**:
   - Create an advanced build pipeline that properly handles thread splitting
   - Enhance the current rspeedy plugin to handle Vue component compilation for Lynx

### Implementation Strategy

The long-term strategy involves:

1. Start with the current bundle transformation approach to get basic Vue apps running
2. Progressively implement the runtime adapter components
3. Create a custom Vue plugin for Lynx-specific functionality
4. Develop proper thread communication and splitting for Vue components
5. Package everything into a standalone `@lynx-js/vue` package similar to `@lynx-js/react`

This gradual approach allows us to deliver working applications while building toward a more robust integration over time.

## Future Improvements

1. **More Complete Element Mapping** - Expand the mapping between Vue elements and Lynx elements.
2. **Better Thread Splitting** - Improve the analysis and splitting of components between threads.
3. **Vue Router Integration** - Add support for Vue Router within the Lynx navigation system.
4. **State Management** - Integrate Pinia or other state management libraries.
5. **Native Module Access** - Provide more streamlined access to native modules through Vue.
6. **Lazy Loading** - Support for Vue's lazy loading features.
7. **Better TypeScript Support** - Enhanced type definitions for Vue-Lynx integration.
8. **Testing Utilities** - Specialized testing tools for Vue-Lynx applications.

## Contributing to Lynx Core

This implementation serves as a prototype for a potential Vue plugin for the Lynx core. The goal is to refine this integration and submit it as a pull request to the official Lynx repository, following the pattern of the ReactLynx plugin.

To contribute to the core Lynx project:
1. Further develop and test this implementation
2. Create a standalone npm package for Vue-Lynx
3. Document the implementation thoroughly
4. Submit a PR to the Lynx core repository 
