# TL;DR: dev notes

some notes on the approach taken to integrate Vue with Lynx

## what are we doing

Lynx is a high-performance UI framework that uses a dual-thread architecture to achieve smooth UI performance. It splits an application into:

- Main thread: Handles UI rendering and user interactions
- Background thread: Handles business logic and state management

Vue, on the other hand, is a progressive JavaScript framework for building user interfaces, with its own rendering system.

## approach

I decided to use a Vite-based approach to integrate Vue with Lynx without removing the existing Vite setup from my [vue-vite-genesis](https://github.com/zanuka/vue-vite-genesis) project starter. This approach involves:

1. **Custom Vite Plugin (`vite-lynx-plugin.js`)**
   - Transforms Vue SFCs for Lynx compatibility
   - Handles dual-thread separation for Vue components

2. **Dedicated Entry Points**
   - `lynx-main.ts`: Main thread entry point that handles UI
   - `lynx-worker.ts`: Background thread for business logic
   - `lynx.html`: HTML entry point for the Lynx app

3. **Vue Component Structure**
   - Template: Rendered in the main thread using Lynx elements
   - Script: Business logic that would run in the worker thread

## Key Files

- **`vite-lynx-plugin.js`**: Custom Vite plugin that transforms Vue components for Lynx
- **`src/lynx-main.ts`**: Main thread entry point
- **`src/lynx-worker.ts`**: Worker thread entry point
- **`src/components/LynxCounter.vue`**: Example component using Lynx elements
- **`lynx.html`**: HTML entry point for the Lynx app
- **`vite.config.mjs`**: Updated Vite configuration with Lynx plugin

## Notes

This integration is still experimental and serves as a proof of concept. For a production-ready integration, a lot more testing is needed and the following should be addressed:

1. Complete implementation of the Vue compiler plugin to properly split code between threads
2. Implementation of a proper Vue runtime for Lynx that leverages Lynx's Element PAPI
3. Proper compilation tools similar to what exists for React in the rspeedy ecosystem

## References

- [Lynx Documentation](https://lynxjs.org/)
- [Vue Documentation](https://vuejs.org/)
- [Vue Core Runtime](https://github.com/vuejs/core/tree/main/packages/runtime-dom)
- [Lynx React Plugin](https://github.com/lynx-family/lynx-stack/blob/main/packages/rspeedy/plugin-react/src/entry.ts) 
