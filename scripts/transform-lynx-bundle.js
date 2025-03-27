import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Check for the bundle file
const inputBundlePath = path.resolve(distDir, 'main.web.bundle');
const outputBundlePath = path.resolve(distDir, 'main.lynx.bundle');

if (!fs.existsSync(inputBundlePath)) {
	console.error(`Error: Input bundle file not found at ${inputBundlePath}`);
	console.error('Make sure to run "bun x rspeedy build" first');
	process.exit(1);
}

console.log('Transforming Lynx bundle for iOS...');

// Read the bundle
const bundleContent = fs.readFileSync(inputBundlePath, 'utf8');

// Create the JavaScript content with metadata
const jsContent = `
// Lynx iOS bundle format metadata
global.__LYNX_BUNDLE_METADATA__ = {
	type: 'vue',
	version: '1.0.0',
	engine: '1.4.0',
	platform: 'ios',
	format: 'lynx-bundle-1',
	entry: 'main',
	timestamp: ${Date.now()}
};

if (typeof global !== 'undefined' && global.__LYNX_SET_BUNDLE_FORMAT__) {
	global.__LYNX_SET_BUNDLE_FORMAT__({
		type: 'vue',
		version: '1.0.0',
		engine: '1.4.0',
		platform: 'ios',
		format: 'lynx-bundle-1',
		entry: 'main'
	});
}

// Main bundle content
${bundleContent}
`;

// Convert to buffer
const contentBuffer = Buffer.from(jsContent, 'utf8');

// Calculate MD5 hash of content
const md5Hash = crypto.createHash('md5').update(contentBuffer).digest();

/*
	Standard Lynx bundle format:
	- 8 bytes: "LYNX" + "BNDL" magic identifier
	- 4 bytes: Version (1.0.0) in little-endian
	- 4 bytes: Platform ID (1 = iOS) in little-endian
	- 4 bytes: Format Type (3 = Vue) in little-endian 
	- 4 bytes: Content size in little-endian
	- 16 bytes: MD5 hash of content
	- 4 bytes: Reserved (0)
	Total header size: 44 bytes
*/

// Create the full Lynx bundle header
const headerBuffer = Buffer.alloc(44);

// Add "LYNX" + "BNDL" magic bytes using specific byte values
headerBuffer[0] = 0x4c; // L
headerBuffer[1] = 0x59; // Y
headerBuffer[2] = 0x4e; // N
headerBuffer[3] = 0x58; // X
headerBuffer[4] = 0x42; // B
headerBuffer[5] = 0x4e; // N
headerBuffer[6] = 0x44; // D
headerBuffer[7] = 0x4c; // L

// Version 1.0.0 (0x00010000 in little-endian)
headerBuffer.writeUInt32LE(0x00010000, 8);

// Platform ID (1 = iOS)
headerBuffer.writeUInt32LE(1, 12);

// Format Type (3 = Vue)
headerBuffer.writeUInt32LE(3, 16);

// Content size
headerBuffer.writeUInt32LE(contentBuffer.length, 20);

// MD5 hash of content (16 bytes)
md5Hash.copy(headerBuffer, 24);

// Reserved bytes (0)
headerBuffer.writeUInt32LE(0, 40);

// Combine header and content
const mainBuffer = Buffer.concat([headerBuffer, contentBuffer]);

// Write the output buffer to file
fs.writeFileSync(outputBundlePath, mainBuffer);

// Also copy to static directory for serving
const staticDir = path.resolve(distDir, 'static');
const staticBundlePath = path.resolve(staticDir, 'main.lynx.bundle');
if (fs.existsSync(staticDir)) {
	fs.copyFileSync(outputBundlePath, staticBundlePath);
	console.log(`Also copied bundle to ${staticBundlePath} for serving`);
}

// Print detailed debug information
console.log(`\nBundle details:`);
console.log(
	`Magic Header bytes: ${Buffer.from([0x4c, 0x59, 0x4e, 0x58, 0x42, 0x4e, 0x44, 0x4c]).toString('hex')}`
);
console.log(
	`Magic Header string: ${Buffer.from([0x4c, 0x59, 0x4e, 0x58, 0x42, 0x4e, 0x44, 0x4c]).toString('utf8')}`
);
console.log(`Version: 0x${(0x00010000).toString(16)}`);
console.log(`Platform: iOS (1)`);
console.log(`Format Type: Vue (3)`);
console.log(`Content Size: ${contentBuffer.length} bytes`);
console.log(`MD5 Hash: ${md5Hash.toString('hex')}`);

console.log(`\nBundle Summary:`);
console.log(`Successfully transformed Lynx bundle at: ${outputBundlePath}`);
console.log(`Header size: ${headerBuffer.length} bytes`);
console.log(`Content size: ${contentBuffer.length} bytes`);
console.log(`Total size: ${mainBuffer.length} bytes`);
