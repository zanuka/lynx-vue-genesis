#!/bin/bash

# Exit on error
set -e

echo "🚀 Building and serving Lynx Vue for iOS..."

# Build the Vue app with rspeedy
echo "🏗️ Building Vue app with rspeedy..."
bun x rspeedy build -c lynx.vue.config.ts

# Create the proper iOS bundle format
echo "🔄 Creating iOS bundle format..."
node scripts/simple-lynx-ios-bundle.js

# Create a simple server
echo "🖥️ Setting up Bun server..."
cat > dist/server.js << 'EOF'
import { serve } from "bun";

const port = 3470;

console.log(`Starting server on port ${port}...`);

serve({
  port,
  development: true,
  fetch(req) {
    const path = new URL(req.url).pathname.slice(1) || "index.html";
    console.log(`Serving: ${path}`);
    return new Response(Bun.file(path));
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
cd dist && bun run server.js 
