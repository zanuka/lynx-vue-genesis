#!/bin/bash

# Exit on error
set -e

echo "🚀 Building Lynx Vue for iOS..."

# Build the loaders
echo "📦 Building loaders..."
bun run build:loaders

# Build the Vue app
echo "🏗️ Building Vue app with rspeedy..."
bun x rspeedy build -c lynx.vue.config.ts

# Create the proper iOS bundle format
echo "🔄 Creating iOS bundle format..."
node scripts/create-ios-lynx-bundle.js

# Create the server.js file
echo "🖥️ Setting up Bun server..."
cat > dist/vue-lynx/simple-server.js << 'EOF'
import { serve } from "bun";

const port = 3470;

console.log(`Starting server on port ${port}...`);

serve({
  port,
  development: true,
  fetch(req) {
    return new Response(Bun.file(new URL(req.url).pathname.slice(1) || "index.html"));
  }
});

console.log(`Server running at http://localhost:${port}/`);
EOF

# Generate QR code
echo "📱 Generating QR code..."
node generate-qr.mjs

# Start the server
echo "🌐 Starting server on port 3470..."
echo "📲 Scan the QR code above with your iOS device or copy the URL to your simulator"
echo "⚠️ Press Ctrl+C to stop the server"
cd dist/vue-lynx && bun run simple-server.js 
