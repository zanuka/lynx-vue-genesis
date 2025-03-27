#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Lynx Vue for iOS..."

# Build with loaders and transform
echo "🏗️ Building Vue app with Lynx bundle format..."
bun run lynx:build

# Start the preview server and QR code generator
echo "🌐 Starting server with QR code..."
echo "📲 Scan the QR code when it appears, or copy the URL to your simulator"
echo "⚠️ Press Ctrl+C to stop the server"

# Generate QR code and run the server in parallel
(sleep 2 && bun run qrcode) & bun x rspeedy preview -c lynx.vue.config.ts 
