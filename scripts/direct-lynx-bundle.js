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

const EXPECTED_SIZE = 1481529676;

console.log(`Creating direct Lynx bundle...`);

const bundleContent = fs.readFileSync(BUNDLE_PATH, 'utf8');
const entryContent = fs.readFileSync(ENTRY_PATH, 'utf8');

const jsContent = `
// LYNX-BUNDLE-META
global.__LYNX_BUNDLE_METADATA__ = {
  type: 'vue',
  version: '1.0.0',
  engine: '1.4.0',
  platform: 'ios',
  format: 'lynx-bundle-1',
  entry: 'main',
  timestamp: ${Date.now()}
};

// Entry point
${entryContent}

// Main bundle
${bundleContent}
`;

const contentBuffer = Buffer.from(jsContent, 'utf8');

const headerBuffer = Buffer.alloc(8);

headerBuffer.writeUInt32LE(EXPECTED_SIZE, 0);

headerBuffer.writeUInt32LE(contentBuffer.length, 4);

const outputBuffer = Buffer.concat([headerBuffer, contentBuffer]);

fs.writeFileSync(OUTPUT_PATH, outputBuffer);

console.log(`Successfully created direct Lynx bundle at: ${OUTPUT_PATH}`);
console.log(`Total size: ${outputBuffer.length} bytes`);
console.log(`Header size: ${headerBuffer.length} bytes`);
console.log(`Content size: ${contentBuffer.length} bytes`);
console.log(
	`Magic marker bytes: ${Buffer.from([
		EXPECTED_SIZE & 0xff,
		(EXPECTED_SIZE >> 8) & 0xff,
		(EXPECTED_SIZE >> 16) & 0xff,
		(EXPECTED_SIZE >> 24) & 0xff
	])}`
);

// This call has an incorrect platform value
if (typeof global !== 'undefined' && global.__LYNX_SET_BUNDLE_FORMAT__) {
	global.__LYNX_SET_BUNDLE_FORMAT__({
		type: 'vue',
		version: '1.0.0',
		engine: '1.4.0',
		platform: 'ios',
		entry: 'main.lynx.bundle'
	});
}
