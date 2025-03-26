# Vue Lynx Rsbuild Plugin

> Vue integration for Lynx applications using Rsbuild

## Overview

The Vue Lynx Rsbuild plugin provides integration between Vue.js and the Lynx framework, enabling the development of Vue applications that run on the Lynx runtime. It configures the necessary loaders, entry points, and optimizations for Lynx-specific features.

## Installation

```bash
# Using npm
npm install @lynx-js/vue-rsbuild-plugin

# Using yarn
yarn add @lynx-js/vue-rsbuild-plugin

# Using bun
bun add @lynx-js/vue-rsbuild-plugin
```

## Usage

### Basic Configuration

Create a `lynx.vue.config.js` file in your project root:

```js
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginVueLynx } from '@lynx-js/vue-rsbuild-plugin';

export default defineConfig({
  source: {
    entry: {
      main: './src/lynx-main.ts',
    },
    include: ['**/*.vue', '**/*.ts'],
    exclude: ['node_modules/**'],
  },
  server: {
    port: 3470,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    filename: '[name].lynx.bundle',
    distPath: {
      root: 'dist/vue-lynx',
      js: '',
    },
    filenameHash: false,
  },
  tools: {
    rspack: {
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        filename: '[name].lynx.bundle',
        chunkFilename: '[name].lynx.bundle',
      },
    },
  },
  plugins: [
    pluginVue(),
    pluginVueLynx({
      enableCSSSelector: true,
      enableParallelElement: true,
      firstScreenSyncTiming: 'immediately',
    }),
  ],
  environments: {
    ios: {}, // iOS environment
    android: {}, // Android environment (optional)
  },
});
```

### Add Scripts to Package.json

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "build:ios:vue": "bun run build:loaders && bun x rspeedy build -c lynx.vue.config.js",
    "dev:ios:vue": "bun run build:loaders && bun x rspeedy dev -c lynx.vue.config.js",
    "dev:ios-qr:vue": "bun run build:loaders && (sleep 5 && bun run qrcode && echo '\nDevelopment server is running in hot-reload mode. Copy the URL above to your simulator.\nPress Ctrl+C to stop.\n') & bun x rspeedy dev -c lynx.vue.config.js"
  }
}
```

### Creating an Entry File

Create a `src/lynx-main.ts` file:

```typescript
import { createApp } from 'vue';
import App from './App.vue';

// Initialize Vue Lynx runtime
if (window.__VUE_LYNX_RUNTIME__) {
  window.__VUE_LYNX_RUNTIME__.init({
    debug: true
  });
}

// Create and mount the Vue app
const app = createApp(App);
app.mount('#app');

// Report first screen timing if available
if (window.__VUE_LYNX_RUNTIME__) {
  window.__VUE_LYNX_RUNTIME__.reportFirstScreenTiming();
}
```

### Adding TypeScript Definitions

Create a `src/types/vue-lynx.d.ts` file:

```typescript
interface VueLynxRuntimeOptions {
  debug?: boolean;
}

interface VueLynxRuntime {
  init: (options?: VueLynxRuntimeOptions) => void;
  reportFirstScreenTiming: () => void;
}

declare global {
  interface Window {
    __VUE_LYNX_RUNTIME__?: VueLynxRuntime;
  }
}

export {};
```

## Plugin Options

The Vue Lynx plugin supports the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCSSSelector` | `boolean` | `false` | Enables CSS selector support |
| `enableParallelElement` | `boolean` | `false` | Enables parallel element rendering |
| `firstScreenSyncTiming` | `'immediately' \| 'jsReady'` | `'immediately'` | Controls when the first screen is synchronized |
| `enableDevTools` | `boolean` | `false` | Enables development tools for debugging |

## Simplified Approach

For a simplified approach without the full plugin, you can use a basic configuration:

```js
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  source: {
    entry: {
      main: './src/lynx-main.ts',
    },
    include: ['**/*.vue', '**/*.ts'],
    exclude: ['node_modules/**'],
  },
  server: {
    port: 3470,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    filename: '[name].lynx.bundle',
    distPath: {
      root: 'dist/vue-lynx',
      js: '',
    },
    filenameHash: false,
  },
  tools: {
    rspack: {
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
      output: {
        filename: '[name].lynx.bundle',
        chunkFilename: '[name].lynx.bundle',
      },
    },
  },
  plugins: [
    pluginVue(),
  ],
  environments: {
    ios: {},
  },
});
```

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:ios:vue:simple": "bun run build:loaders && bun x rspeedy build -c lynx.vue.simple.config.js",
    "dev:ios:vue:simple": "bun run build:loaders && bun x rspeedy dev -c lynx.vue.simple.config.js",
    "dev:ios-qr:vue:simple": "bun run build:loaders && (sleep 5 && bun run qrcode && echo '\nDevelopment server is running in hot-reload mode. Copy the URL above to your simulator.\nPress Ctrl+C to stop.\n') & bun x rspeedy dev -c lynx.vue.simple.config.js"
  }
}
```

## Development Notes

### Key Points

1. The Vue Lynx plugin configures the necessary loaders and plugins for Vue components to work in the Lynx environment
2. It ensures proper CSS handling and optimization for Lynx's rendering engine
3. It manages the entry points for both the main thread and background processes
4. It handles source maps and hot module replacement for development

### Compatibility

The Vue Lynx plugin is designed to work with:

- Vue 3.x
- Rsbuild 1.x
- Rspack 1.x
- TypeScript 4.x+

### Known Issues

- CSS modules may require additional configuration
- Transitions and animations might need Lynx-specific adaptation
- Components using browser-specific APIs might need alternatives in Lynx

## Future Enhancements

- Add support for Vue Router
- Improve CSS inheritance and invalidation controls
- Add support for ICU message format
- Enhance the development tools and debugging experience
