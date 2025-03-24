# vue-lynx-genesis

This is a prototype that integrates Lynx's powerful multi-threaded UI rendering capabilities with Vue's component system and Vite's lightning-fast development environment. 

As noted in issue [193](https://github.com/lynx-family/lynx/issues/193) of the official lynx repo, support for Vue in Lynx is has been gaining support, so I decided to create this project as a starting point.

I'm currently working on porting the logic to a standalone Vite plugin (npm package) to acheive the following: 

- Simplified Integration: reduce the current complex setup to a single plugin installation and minimal configuration
- Zero-config Option: could provide sensible defaults that work out-of-the-box for most Vue projects
- Consistent Implementation: ensure best practices are followed automatically across different projects

The integration allows Vue applications to achieve smooth 60+ FPS animations, jank-free scrolling, and responsive interfaces by offloading business logic to a separate thread while keeping the UI rendering thread free for user interactions. 

This could represent a significant advancement for Vue developers looking to build high-performance applications that feel as responsive as native apps.

more implementation notes in [TL;DR:](docs/tldr.md)

### Counter Demo
After running `bun install` and `bun run dev:lynx` you should see this demo app running a basic counter component at http://127.0.0.1:3000

![Vue-Lynx Counter Component](/src/assets/vue-lynx-counter.png)

### Debug Panel
In addition, there's a debug panel that will load below the counter.

![Vue-Lynx Debug Panel](/src/assets/vue-lynx-debug.png)
The debug panel shows an example of the following Lynx features:
- Main thread/worker thread separation for UI performance
- async message-based communication between threads
- real-time state synchronization across thread boundaries
- bidirectional message flow with timestamps
- live monitoring of the Lynx thread communication model


## Features

- 🎨 **Modern UI with Tailwind CSS**
  - Clean, responsive design
  - Beautiful component styling
  - Dark mode support
  - Custom animations and transitions

- 🔥 **Lynx Integration**
  - Multi-threaded UI rendering via Lynx
  - Thread separation with main thread for UI and worker thread for logic
  - Custom Vite plugin for seamless Vue-Lynx integration
  - Debug panel for visualizing thread communication
  - Fallback handling for graceful degradation

- 🛠️ **Development Tools**
  - [Vite](https://github.com/vitejs/vite) for lightning-fast development
  - [TypeScript](https://www.typescriptlang.org/) for type safety
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [ESLint](https://eslint.vuejs.org/) and [Prettier](https://prettier.io/) for code quality
  - [Vitest](https://vitest.dev/) for unit testing
  - [Cypress](https://docs.cypress.io) for E2E testing
  - [Webpack](https://webpack.js.org/) for bundling Lynx components

- 📦 **Core Dependencies**
  - [Vue 3](https://v3.vuejs.org/) with Composition API
  - [Vue Router](https://next.router.vuejs.org/) for routing
  - [Pinia](https://pinia.vuejs.org/) for state management
  - [Axios](https://axios-http.com/) for API requests
  - [@vueuse/core](https://vueuse.org/) for composables
  - [@lynx-js/web-core](https://lynxjs.org/) for Lynx runtime
  - [@lynx-js/web-elements](https://lynxjs.org/) for Lynx UI elements
  - [@lynx-js/rspeedy](https://lynxjs.org/) for Lynx build system
  - [HeadlessUI](https://headlessui.dev/) for unstyled, accessible UI components
  - [Heroicons](https://heroicons.com/) for SVG icons

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Start Lynx development server
bun dev:lynx

# Build for production
bun build

# Preview production build
bun serve

# Run tests
bun test
```

## Development Scripts

- `bun dev` - Start development server
  - Runs the traditional Vue application without Lynx integration
  - Useful for compatibility testing and comparing performance
  - Provides a fallback development environment

- `bun dev:lynx` - Start Lynx development server
  - Opens the application with Lynx integration at `/lynx.html`
  - Demonstrates the multi-threaded UI architecture
  - Shows real-time thread communication in the debug panel

- `bun build` - Build for production
- `bun build:lynx` - Build Lynx bundle
- `bun serve` - Preview production build
- `bun test` - Run all tests
- `bun test:unit` - Run unit tests
- `bun test:unit:vitest:ui` - Run unit tests with UI
- `bun lint` - Run linting
- `bun clean:cache` - Clean cache
- `bun clean:lib` - Clean dependencies

While the project is evolving, both standard and Lynx-enabled development paths are maintained to allow for testing, comparison, and gradual component migration.

## Vue-Lynx Integration

This project includes an integration between [Vue](https://vuejs.org/) and [Lynx](https://lynxjs.org/), enabling developers to leverage Vue's component system with Lynx's high-performance rendering engine.

### What is Lynx?

Lynx is a high-performance UI framework that uses a dual-thread architecture to achieve smooth 60+ FPS rendering:
- **Main Thread**: Handles UI rendering and user interactions
- **Background Thread**: Handles business logic and state management

This separation ensures that UI operations never block the main thread, resulting in smoother animations and more responsive interfaces.

### integration approach

1. **Custom Vue Components for Lynx**
   - Uses custom elements like `<view>` and `<text>` instead of standard HTML
   - Components automatically work with the dual-thread architecture

2. **Thread Communication**
   - Background worker thread for business logic and state management
   - Main thread for UI rendering and user interaction
   - Message-based communication between threads

3. **Vite Plugin Integration**
   - Custom Vite plugin to handle Lynx-specific elements
   - Vue compiler configuration to treat Lynx elements as custom elements
   - Seamless developer experience with Vue Single File Components

4. **Debugging Tools**
   - Built-in debug panel to visualize thread communication
   - Console logging with thread identification
   - Error handling and fallbacks for robustness

### Example Component

```vue
<!-- LynxCounter.vue -->
<template>
  <view class="counter-container">
    <text class="counter-title">Lynx Counter Demo</text>
    <text class="counter-value">Count: {{ count }}</text>
    <view class="button-row">
      <button @click="decrement">-</button>
      <button @click="increment">+</button>
      <button @click="reset">Reset</button>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'LynxCounter',
  setup() {
    const count = ref(0);
    
    function increment() {
      count.value++;
      // In a real app, you'd send this to the worker thread:
      // worker.postMessage({ type: 'METHOD_CALL', method: 'increment' });
    }
    
    function decrement() {
      count.value--;
    }
    
    function reset() {
      count.value = 0;
    }
    
    return { count, increment, decrement, reset };
  }
};
</script>
```

### Getting Started with Lynx

To start using Lynx in your Vue components:

1. Create components in the `src/components/` directory with names prefixed with "Lynx"
2. Use Lynx-specific elements like `<view>` and `<text>` instead of `<div>` and `<span>`
3. Run the Lynx development server with `bun dev:lynx`
4. View your Lynx components at http://localhost:3000/lynx.html

### Key Files

- `vite.config.mjs`: Contains Vue configuration for Lynx custom elements
- `vite-lynx-plugin.js`: Vite plugin for Lynx integration
- `lynx.html`: Entry point for the Lynx application
- `src/lynx-main.ts`: Main thread entry point
- `src/lynx-worker.ts`: Worker thread for business logic
- `src/components/LynxHelloWorld.vue`: Example Lynx component
- `src/components/LynxCounter.vue`: Example counter component
- `src/components/LynxDebugPanel.vue`: Debug panel for thread visualization

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Vue components (including Lynx components)
├── composables/   # Vue composables
├── layouts/       # Layout components
├── router/        # Vue Router configuration
├── stores/        # Pinia stores
├── styles/        # Global styles
├── types/         # TypeScript types
├── views/         # Page components
├── lynx-main.ts   # Lynx main thread entry
└── lynx-worker.ts # Lynx worker thread
```

## Testing Lynx Components

Testing components that use Lynx elements requires a specialized approach due to the custom elements being used. I tried getting it to work with Vitest, but ran into multiple issues. For now, the project includes multiple testing strategies:

### Component Validation

For reliable component validation, use the component checker:

```bash
# Run the component validator
bun test:components
```

This validator:
- Checks all components in the `src/components` directory
- Verifies Vue SFC structure using the Vue compiler
- Identifies Lynx components automatically
- Provides a clear summary of valid and invalid components

### Basic Component Tests

For simple component existence validation:

```bash
# Run simplified component tests
bun test:simple
```

This validates that components exist and can be loaded without executing complex test logic.

### Traditional Testing (Known Issues)

The project also includes Vitest configuration, but there are known issues with testing Lynx components using Vitest:

```bash
# Run Vitest UI (may encounter stalling issues with Lynx components)
bun test:unit:vitest:ui
```

> **Important**: The traditional tests using Vitest may stall when testing Lynx components due to issues with custom elements in JSDOM. Use the component validator approach instead for reliable testing.

### Recommended Testing Workflow

1. Use `bun test:components` for regular validation during development
2. Add specific test cases to the simplified test runners when needed
3. Only use the Vitest framework for standard Vue components (non-Lynx)

This approach provides reliable validation while working with the experimental Lynx integration.

## Webpack and Vite Integration

This project uses both Vite and Webpack for different purposes:

### Why Both Bundlers?

- **Vite** powers the main Vue application with its fast development server and optimized production builds.
- **Webpack** specifically handles the Vue-Lynx integration via `webpack.lynx.config.js`.

### The Role of webpack.lynx.config.js

The `webpack.lynx.config.js` file serves several critical functions:

1. **Custom Lynx Handling**: Processes `.lynx` files and integrates them with Vue components
2. **Thread Separation**: Bundles the Lynx-specific code that runs in the worker thread
3. **Vue Loader Integration**: Ensures Vue SFCs work properly with Lynx elements 
4. **Output Generation**: Creates the `main.web.bundle` file in the public directory that powers the Lynx runtime

This dual-bundler approach allows us to leverage Vite's speed for general Vue development while using Webpack's flexibility for the specialized Lynx integration requirements.

### Build Process

When developing or building:

1. `bun dev` runs the standard Vite development server
2. `bun dev:lynx` runs Vite but loads the Lynx-enabled entry point
3. `bun build:lynx:webpack` runs Webpack to build the Lynx bundle
4. `bun build` runs the standard Vite build process

This separation makes it possible to incrementally adopt Lynx in an existing Vue application without disrupting the standard workflow.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Author

Copyright (c) 2025-present, Mike Delucchi - Zanuka Labs LLC.
