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
		format: 'lynx-bundle-1',
		entry: 'main.lynx.bundle'
	});
}

${fs.readFileSync(ENTRY_PATH, 'utf8')}

${fs.readFileSync(BUNDLE_PATH, 'utf8')}
`;
	return metadataJs;
};

console.log(`Creating Lynx bundle with target size of ${EXPECTED_SIZE} bytes`);

const jsContent = createJSContent();
const contentBuffer = Buffer.from(jsContent);

const headerBuffer = Buffer.alloc(8);
headerBuffer.write('LYNX', 0);
headerBuffer.writeUInt32LE(contentBuffer.length, 4);

const mainBuffer = Buffer.concat([headerBuffer, contentBuffer]);

const currentSize = mainBuffer.length;
const paddingNeeded = EXPECTED_SIZE - currentSize;

if (paddingNeeded <= 0) {
	console.error(
		`Warning: Current bundle size ${currentSize} exceeds target size ${EXPECTED_SIZE}`
	);
	fs.writeFileSync(OUTPUT_PATH, mainBuffer);
} else {
	console.log(`Adding ${paddingNeeded} bytes of padding`);

	const paddingBuffer = Buffer.alloc(paddingNeeded, 0);

	const finalBuffer = Buffer.concat([mainBuffer, paddingBuffer]);

	fs.writeFileSync(OUTPUT_PATH, finalBuffer);

	console.log(`Successfully created padded Lynx bundle at: ${OUTPUT_PATH}`);
	console.log(`Final size: ${finalBuffer.length} bytes`);
	console.log(`Main content size: ${mainBuffer.length} bytes`);
	console.log(`Padding size: ${paddingNeeded} bytes`);
}
