import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const BUNDLE_PATH = path.resolve(
	__dirname,
	'../dist/vue-lynx/main.lynx.bundle'
);
const ENTRY_PATH = path.resolve(
	__dirname,
	'../dist/vue-lynx/vue-lynx-entry.js'
);
const OUTPUT_PATH = path.resolve(
	__dirname,
	'../dist/vue-lynx/main.lynx.bundle'
);

// Check for watch flag
const isWatchMode = process.argv.includes('--watch');

// Function to create the bundle
function createBundle() {
	console.log('Creating Lynx iOS bundle...');

	// Create the JavaScript content with metadata
	const createJSContent = () => {
		const metadataJs = `
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
    entry: 'main.lynx.bundle'
  });
}

${fs.readFileSync(ENTRY_PATH, 'utf8')}

${fs.readFileSync(BUNDLE_PATH, 'utf8')}
`;
		return metadataJs;
	};

	try {
		// Generate the JavaScript content
		const jsContent = createJSContent();
		const contentBuffer = Buffer.from(jsContent, 'utf8');

		// Calculate MD5 hash of content
		const md5Hash = crypto.createHash('md5').update(contentBuffer).digest();

		// Lynx bundle format header (magic bytes)
		const LYNX_BUNDLE_HEADER = Buffer.from([
			// Magic identifier "LYNX"
			0x4c, 0x59, 0x4e, 0x58,
			// Bundle type "BNDL"
			0x42, 0x4e, 0x44, 0x4c,
			// Version 1.0 (little endian)
			0x00, 0x01, 0x00, 0x00,
			// Platform: iOS (1)
			0x01, 0x00, 0x00, 0x00,
			// Format: Vue (3) - using value 3 assuming 1=js, 2=react, 3=vue
			0x03, 0x00, 0x00, 0x00
		]);

		// Create a buffer that includes header and metadata
		const headerSize = LYNX_BUNDLE_HEADER.length + 24; // Header + size fields
		const headerBuffer = Buffer.alloc(headerSize);

		// Copy the magic header
		LYNX_BUNDLE_HEADER.copy(headerBuffer, 0);

		// Write content size (little endian)
		headerBuffer.writeUInt32LE(contentBuffer.length, LYNX_BUNDLE_HEADER.length);

		// Write content MD5 hash (16 bytes)
		md5Hash.copy(headerBuffer, LYNX_BUNDLE_HEADER.length + 4);

		// Write reserved bytes (4 bytes)
		headerBuffer.writeUInt32LE(0, LYNX_BUNDLE_HEADER.length + 20);

		// Combine header and content
		const outputBuffer = Buffer.concat([headerBuffer, contentBuffer]);

		// Backup the current file if it exists
		if (fs.existsSync(OUTPUT_PATH)) {
			const backupPath = `${OUTPUT_PATH}.backup`;
			fs.copyFileSync(OUTPUT_PATH, backupPath);
		}

		// Write the final bundle to the output file
		fs.writeFileSync(OUTPUT_PATH, outputBuffer);

		console.log(`Successfully created Lynx iOS bundle at: ${OUTPUT_PATH}`);
		console.log(`Header size: ${headerBuffer.length} bytes`);
		console.log(`Content size: ${contentBuffer.length} bytes`);
		console.log(`Total size: ${outputBuffer.length} bytes`);
		console.log(`MD5 hash: ${md5Hash.toString('hex')}`);
		return true;
	} catch (error) {
		console.error('Error creating bundle:', error);
		return false;
	}
}

// Create the bundle once
createBundle();

// Set up file watching if in watch mode
if (isWatchMode) {
	console.log('Watching for changes...');

	// Watch the source files for changes
	fs.watch(path.dirname(BUNDLE_PATH), (eventType, filename) => {
		if (
			filename &&
			(filename.endsWith('.js') || filename.endsWith('.bundle'))
		) {
			console.log(`File ${filename} changed. Rebuilding bundle...`);
			createBundle();
		}
	});

	// Keep the process alive
	process.stdin.resume();

	// Handle process termination
	process.on('SIGINT', () => {
		console.log('Watch mode terminated.');
		process.exit(0);
	});
}
