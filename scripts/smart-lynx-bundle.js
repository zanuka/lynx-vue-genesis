import crypto from 'crypto';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const MAGIC_MARKER = 'LYNX';
const EXPECTED_SIZE = 1481529676;

console.log('Creating smart Lynx bundle...');

const bundleContent = fs.readFileSync(BUNDLE_PATH, 'utf8');
const entryContent = fs.readFileSync(ENTRY_PATH, 'utf8');

const jsContent = `
// LYNX-BUNDLE-FORMAT-1.0
// This is a Vue Lynx bundle - the binary header must be preserved

// Initialize the Lynx runtime environment
global.__LYNX_BUNDLE_METADATA__ = {
  type: 'vue',
  version: '1.0.0',
  engine: '1.4.0',
  platform: 'ios',
  format: 'lynx-bundle-1',
  entry: 'main',
  timestamp: ${Date.now()}
};

// Set up the Lynx runtime integration
if (typeof global !== 'undefined' && global.__LYNX_SET_BUNDLE_FORMAT__) {
  global.__LYNX_SET_BUNDLE_FORMAT__({
    type: 'vue',
    version: '1.0.0',
    engine: '1.4.0',
    platform: 'lynx-bundle-1',
    entry: 'main.lynx.bundle'
  });
}

// Entry Point
${entryContent}

// Main Bundle
${bundleContent}
`;

const contentBuffer = Buffer.from(jsContent, 'utf8');

const md5Hash = crypto.createHash('md5').update(contentBuffer).digest();

const headerBuffer = Buffer.alloc(32);

headerBuffer.write(MAGIC_MARKER, 0);
headerBuffer.writeUInt32LE(EXPECTED_SIZE, 4);
headerBuffer.writeUInt32LE(contentBuffer.length, 8);
headerBuffer.writeUInt32LE(1, 12);
headerBuffer.writeUInt8(1, 16); // Major
headerBuffer.writeUInt8(0, 17); // Minor
headerBuffer.writeUInt8(0, 14); // Patch
headerBuffer.writeUInt8(0, 15); // Build

md5Hash.copy(headerBuffer, 16);
let finalBuffer;
if (headerBuffer.length + contentBuffer.length < EXPECTED_SIZE) {
	const paddingSize =
		EXPECTED_SIZE - (headerBuffer.length + contentBuffer.length);
	console.log(
		`Adding ${paddingSize} bytes of padding to match expected size...`
	);

	const paddingBuffer = Buffer.alloc(paddingSize, 0);

	finalBuffer = Buffer.concat([headerBuffer, contentBuffer, paddingBuffer]);
} else {
	finalBuffer = Buffer.concat([headerBuffer, contentBuffer]);
}

fs.writeFileSync(OUTPUT_PATH, finalBuffer);

console.log(`Successfully created smart Lynx bundle at: ${OUTPUT_PATH}`);
console.log(`Total size: ${finalBuffer.length} bytes`);
console.log(`Header size: ${headerBuffer.length} bytes`);
console.log(`Content size: ${contentBuffer.length} bytes`);
console.log(`MD5 hash: ${md5Hash.toString('hex')}`);

const debugPath = path.resolve(__dirname, '../dist/vue-lynx/bundle-debug.json');
fs.writeFileSync(
	debugPath,
	JSON.stringify(
		{
			header: {
				magic: MAGIC_MARKER,
				expectedSize: EXPECTED_SIZE,
				contentSize: contentBuffer.length,
				version: '1.0.0.0',
				md5: md5Hash.toString('hex')
			},
			contentPreview: jsContent.substring(0, 200) + '...',
			totalSize: finalBuffer.length
		},
		null,
		2
	)
);
