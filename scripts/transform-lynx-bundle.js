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

// Create the JavaScript content with proper initialization
const jsContent = `
// Lynx iOS bundle format metadata
window.__LYNX_BUNDLE_METADATA__ = {
	type: 'vue',
	version: '1.0.0',
	engine: '1.4.0',
	platform: 'ios',
	format: 'lynx-bundle-1',
	entry: 'main',
	timestamp: ${Date.now()}
};

// LynxExplorer compatibility setup
if (typeof window.__LYNX_SET_BUNDLE_FORMAT__ === 'function') {
	window.__LYNX_SET_BUNDLE_FORMAT__({
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

// Create a custom binary format that's simpler than the standard format
// Just prefixing with a simple header
const LYNX_MAGIC = 'LYNXv1.0'; // Simple 8-byte magic identifier
const headerSize = 32; // Simple fixed size header

const headerBuffer = Buffer.alloc(headerSize);

// 8 bytes: Magic identifier
headerBuffer.write(LYNX_MAGIC, 0);

// 4 bytes: Content length as UInt32 Little Endian
headerBuffer.writeUInt32LE(contentBuffer.length, 8);

// 4 bytes: Reserved (0)
headerBuffer.writeUInt32LE(0, 12);

// 16 bytes: MD5 hash
md5Hash.copy(headerBuffer, 16);

// Combine header and content
const fullBuffer = Buffer.concat([headerBuffer, contentBuffer]);

// Write the binary bundle
fs.writeFileSync(outputBundlePath, fullBuffer);

// Create a debug version with minimal content for testing
const debugContent = `
// Minimal test bundle
console.log("Lynx Debug Bundle loaded!");

// Set required metadata
window.__LYNX_BUNDLE_METADATA__ = {
	type: 'vue',
	version: '1.0.0',
	engine: '1.4.0',
	platform: 'ios',
	format: 'lynx-bundle-1',
	entry: 'main',
	timestamp: ${Date.now()}
};

// Set bundle format if the function exists
if (typeof window.__LYNX_SET_BUNDLE_FORMAT__ === 'function') {
	window.__LYNX_SET_BUNDLE_FORMAT__({
		type: 'vue',
		version: '1.0.0',
		engine: '1.4.0',
		platform: 'ios',
		format: 'lynx-bundle-1',
		entry: 'main'
	});
}

// Create a visible UI element to confirm loading
setTimeout(function() {
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.top = '20px';
	container.style.left = '20px';
	container.style.right = '20px';
	container.style.padding = '20px';
	container.style.backgroundColor = '#f0f9ff';
	container.style.borderRadius = '8px';
	container.style.fontFamily = 'system-ui, sans-serif';
	container.style.zIndex = '999';
	container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
	
	const heading = document.createElement('h2');
	heading.textContent = 'Lynx Debug Bundle';
	heading.style.color = '#333';
	heading.style.margin = '0 0 10px 0';
	
	const infoText = document.createElement('p');
	infoText.textContent = 'Bundle loaded successfully at ' + new Date().toLocaleTimeString();
	infoText.style.color = '#666';
	
	container.appendChild(heading);
	container.appendChild(infoText);
	document.body.appendChild(container);
}, 500);
`;

// Convert debug content to buffer
const debugBuffer = Buffer.from(debugContent, 'utf8');

// Calculate MD5 hash for debug content
const debugMd5Hash = crypto.createHash('md5').update(debugBuffer).digest();

// Create header for debug bundle
const debugHeaderBuffer = Buffer.alloc(headerSize);
debugHeaderBuffer.write(LYNX_MAGIC, 0);
debugHeaderBuffer.writeUInt32LE(debugBuffer.length, 8);
debugHeaderBuffer.writeUInt32LE(0, 12);
debugMd5Hash.copy(debugHeaderBuffer, 16);

// Combine header and debug content
const debugFullBuffer = Buffer.concat([debugHeaderBuffer, debugBuffer]);

// Create debug directory if it doesn't exist
const debugDir = path.resolve(distDir, 'debug');
if (!fs.existsSync(debugDir)) {
	fs.mkdirSync(debugDir, { recursive: true });
}

// Write debug bundle
const debugBundlePath = path.resolve(debugDir, 'simple.lynx.bundle');
fs.writeFileSync(debugBundlePath, debugFullBuffer);

// Also create a flat text file version for comparison
const flatDebugPath = path.resolve(debugDir, 'simple.debug.js');
fs.writeFileSync(flatDebugPath, debugContent);

// Also copy to static directory for serving
const staticDir = path.resolve(distDir, 'static');
const staticBundlePath = path.resolve(staticDir, 'main.lynx.bundle');
if (fs.existsSync(staticDir)) {
	fs.copyFileSync(outputBundlePath, staticBundlePath);
	console.log(`Copied main bundle to ${staticBundlePath} for serving`);

	// Copy debug bundle to static folder too
	fs.copyFileSync(
		debugBundlePath,
		path.resolve(staticDir, 'simple.lynx.bundle')
	);
	console.log(`Copied debug bundle to static directory`);
}

// Create a version with alternative header configurations for testing
const createAltVersions = true;
if (createAltVersions) {
	// Create a version with 44-byte header (original format)
	const alt1HeaderBuffer = Buffer.alloc(44);

	// Magic bytes "LYNX" + "BNDL"
	alt1HeaderBuffer[0] = 0x4c; // L
	alt1HeaderBuffer[1] = 0x59; // Y
	alt1HeaderBuffer[2] = 0x4e; // N
	alt1HeaderBuffer[3] = 0x58; // X
	alt1HeaderBuffer[4] = 0x42; // B
	alt1HeaderBuffer[5] = 0x4e; // N
	alt1HeaderBuffer[6] = 0x44; // D
	alt1HeaderBuffer[7] = 0x4c; // L

	// Version: 1.0.0
	alt1HeaderBuffer.writeUInt32LE(0x00010000, 8);

	// Platform: iOS (1)
	alt1HeaderBuffer.writeUInt32LE(1, 12);

	// Format: Vue (3)
	alt1HeaderBuffer.writeUInt32LE(3, 16);

	// Content size (try big-endian to see if that's what's expected)
	alt1HeaderBuffer.writeUInt32BE(debugBuffer.length, 20);

	// MD5 hash
	debugMd5Hash.copy(alt1HeaderBuffer, 24);

	// Reserved (0)
	alt1HeaderBuffer.writeUInt32LE(0, 40);

	// Combine and write
	const alt1Bundle = Buffer.concat([alt1HeaderBuffer, debugBuffer]);
	const alt1Path = path.resolve(debugDir, 'alt1.lynx.bundle');
	fs.writeFileSync(alt1Path, alt1Bundle);
	fs.copyFileSync(alt1Path, path.resolve(staticDir, 'alt1.lynx.bundle'));

	// Create a version with 44-byte header, using little-endian
	const alt2HeaderBuffer = Buffer.alloc(44);
	alt2HeaderBuffer.write('LYNXBNDL', 0);
	alt2HeaderBuffer.writeUInt32LE(0x00010000, 8);
	alt2HeaderBuffer.writeUInt32LE(1, 12);
	alt2HeaderBuffer.writeUInt32LE(3, 16);
	alt2HeaderBuffer.writeUInt32LE(debugBuffer.length, 20);
	debugMd5Hash.copy(alt2HeaderBuffer, 24);
	alt2HeaderBuffer.writeUInt32LE(0, 40);

	const alt2Bundle = Buffer.concat([alt2HeaderBuffer, debugBuffer]);
	const alt2Path = path.resolve(debugDir, 'alt2.lynx.bundle');
	fs.writeFileSync(alt2Path, alt2Bundle);
	fs.copyFileSync(alt2Path, path.resolve(staticDir, 'alt2.lynx.bundle'));

	console.log(`Created alternative bundle formats for testing`);
}

console.log(`\nBundle Summary:`);
console.log(`Successfully created binary bundles with headers`);
console.log(`Main bundle: ${outputBundlePath} (${fullBuffer.length} bytes)`);
console.log(
	`Debug bundle: ${debugBundlePath} (${debugFullBuffer.length} bytes)`
);
console.log(`Flat debug JS: ${flatDebugPath}`);

console.log(`\nHeader Details:`);
console.log(`Magic: "${LYNX_MAGIC}"`);
console.log(`Header Size: ${headerSize} bytes`);
console.log(`Content Size: ${contentBuffer.length} bytes`);
console.log(`MD5: ${md5Hash.toString('hex')}`);

console.log(
	`\nTry all formats using the debug server to find what works in the simulator`
);
if (createAltVersions) {
	console.log(
		`Also created alternative bundle formats to test in the simulator:`
	);
	console.log(
		`- Alternative 1: http://[your-ip]:3471/alt1.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`- Alternative 2: http://[your-ip]:3471/alt2.lynx.bundle?platform=ios&fullscreen=true`
	);
}
