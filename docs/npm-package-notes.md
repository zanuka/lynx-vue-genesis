# Creating an npm Package for Vue-Lynx Integration

This document outlines the steps for creating an npm package that provides Vue.js integration for Lynx.

## Package Structure

The npm package for Vue-Lynx integration should be structured as follows:

```
vue-lynx/
├── dist/            # Built files
├── src/             # Source files
│   ├── loaders/     # Webpack loaders
│   │   ├── background.js
│   │   └── main-thread.js
│   ├── plugin/      # rspeedy plugin
│   │   └── index.js
│   ├── runtime/     # Runtime adapters
│   │   ├── index.js
│   │   └── thread-communication.js
│   └── webpack/     # Webpack plugin
│       └── plugin.js
├── templates/       # Template files for Vue-Lynx projects
├── package.json     # Package configuration
├── README.md        # Documentation
└── LICENSE          # License file
```

## Building the Package

1. **Compile the Source Files**: Transpile TypeScript/ESM to CommonJS for better compatibility.

2. **Create Entry Points**: Generate appropriate entry points for different bundlers.

3. **Bundle the Templates**: Include project templates for easy setup.

## Package.json Configuration

The `package.json` should include:

```json
{
  "name": "@lynx-js/vue-plugin",
  "version": "0.1.0",
  "description": "Vue.js integration for Lynx",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    },
    "./runtime": {
      "require": "./dist/runtime/index.js",
      "import": "./dist/runtime/index.mjs",
      "types": "./dist/runtime/index.d.ts"
    }
  },
  "files": [
    "dist",
    "templates"
  ],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "lynx",
    "vue",
    "mobile",
    "native"
  ],
  "peerDependencies": {
    "@lynx-js/rspeedy": ">=0.8.0",
    "vue": "^3.3.0"
  },
  "dependencies": {
    "@lynx-js/template-webpack-plugin": "^0.8.0",
    "@lynx-js/webpack-runtime-globals": "^0.8.0",
    "tiny-invariant": "^1.3.1"
  },
  "devDependencies": {
    "tsup": "^7.2.0",
    "typescript": "^5.0.4",
    "vitest": "^0.32.2"
  }
}
```

## Publishing Process

1. **Prepare the Package**:
   ```bash
   npm run build
   ```

2. **Test the Package Locally**:
   ```bash
   npm pack
   # Then install the resulting .tgz file in a test project
   ```

3. **Publish to npm**:
   ```bash
   npm publish --access public
   ```

## Using the Package in Lynx Projects

The package can be used in Lynx projects as follows:

```js
// lynx.config.js
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVueLynx } from '@lynx-js/vue-plugin';

export default defineConfig({
  // ... other config
  plugins: [
    pluginVueLynx({
      platform: 'ios', // or 'android', 'web'
      enableDevTools: true
    })
  ]
});
```

## Contributing to Lynx Core

Once the npm package has been created and tested, you can contribute it to the Lynx core by:

1. **Fork the Lynx Stack Repository**: Create a fork of the `lynx-family/lynx-stack` repository.

2. **Create a New Package**: Add your package to the `packages` directory.

3. **Submit a Pull Request**: Submit a PR with your changes and document the usage.

4. **Update Documentation**: Add Vue.js documentation to the Lynx main documentation site.

## Next Steps

1. **Write Tests**: Create comprehensive unit and integration tests.

2. **Create Examples**: Build example projects that showcase Vue-Lynx integration.

3. **Improve Performance**: Optimize the runtime for better performance.

4. **Add More Features**: Support for Vue Router, Pinia state management, etc. 
