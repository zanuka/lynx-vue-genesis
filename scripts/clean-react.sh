#!/bin/bash

# Remove React configuration files
echo "Removing React configuration files..."
rm -f lynx.react.config.ts
rm -f lynx.react.minimal.config.ts

# Remove React dependencies from package.json
echo "Removing React dependencies from package.json..."
bun remove @babel/preset-react @lynx-js/react @lynx-js/react-rsbuild-plugin @rsbuild/plugin-react @types/react @types/react-dom react react-dom

# Remove React scripts from package.json
echo "Updating package.json scripts..."
sed -i '' '/build:ios:react/d' package.json
sed -i '' '/dev:ios:react/d' package.json
sed -i '' '/dev:ios-qr:react/d' package.json
sed -i '' '/build:ios:react:minimal/d' package.json

# Remove any React source files
echo "Removing React source files..."
find src -name "*.react.*" -delete
find src -name "*React*" -delete

echo "React cleanup complete!" 
