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

const bundleContent = fs.readFileSync(BUNDLE_PATH, 'utf8');
const entryContent = fs.readFileSync(ENTRY_PATH, 'utf8');
const jsContent = `
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

${entryContent}

${bundleContent}
`;

const contentBuffer = Buffer.from(jsContent, 'utf8');

const md5Hash = crypto.createHash('md5').update(contentBuffer).digest();

const headerSize = 30;
const headerBuffer = Buffer.alloc(headerSize);

headerBuffer.write('LYNX', 0);
headerBuffer.writeUInt8(1, 4);
headerBuffer.writeUInt8(0, 5);
headerBuffer.writeUInt16LE(0, 6);
headerBuffer.writeUInt32LE(contentBuffer.length, 8);
headerBuffer.writeUInt16LE(1, 12);
md5Hash.copy(headerBuffer, 14);

const outputBuffer = Buffer.concat([headerBuffer, contentBuffer]);

fs.writeFileSync(OUTPUT_PATH, outputBuffer);

console.log(`Successfully created Lynx bundle at: ${OUTPUT_PATH}`);
console.log(`Total size: ${outputBuffer.length} bytes`);
console.log(`Header size: ${headerSize} bytes`);
console.log(`Content size: ${contentBuffer.length} bytes`);
console.log(`MD5 hash: ${md5Hash.toString('hex')}`);

const debugPath = path.resolve(__dirname, '../dist/vue-lynx/bundle-debug.json');
fs.writeFileSync(
	debugPath,
	JSON.stringify(
		{
			header: {
				magic: 'LYNX',
				version: '1.0',
				flags: 0,
				contentSize: contentBuffer.length,
				sectionCount: 1,
				md5: md5Hash.toString('hex')
			},
			contentPreview: jsContent.substring(0, 200) + '...',
			totalSize: outputBuffer.length
		},
		null,
		2
	)
);
