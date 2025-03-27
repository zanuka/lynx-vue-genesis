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

// COMPLETELY NEW APPROACH:
// Create a JSON string that encapsulates the bundle format properly
const bundleMetadata = {
	type: 'vue',
	version: '1.0.0',
	engine: '1.4.0',
	platform: 'ios',
	format: 'lynx-bundle-1',
	entry: 'main',
	timestamp: Date.now()
};

// Create the JavaScript content with proper header
const jsContent = `
// Lynx Bundle Format JSON
window.__LYNX_BUNDLE_FORMAT__ = ${JSON.stringify(bundleMetadata)};

// Bundle initialization
window.addEventListener('load', function() {
  console.log('Lynx Vue Bundle loaded!');
  if (typeof window.__LYNX_SET_BUNDLE_FORMAT__ === 'function') {
    window.__LYNX_SET_BUNDLE_FORMAT__(window.__LYNX_BUNDLE_FORMAT__);
  }
});

// Main bundle content
${bundleContent}
`;

// Convert to buffer
const contentBuffer = Buffer.from(jsContent, 'utf8');

// Create a debug version with minimal content for testing
const debugContent = `
// Lynx Bundle Format JSON
window.__LYNX_BUNDLE_FORMAT__ = ${JSON.stringify(bundleMetadata)};

// Bundle initialization
window.addEventListener('load', function() {
  console.log('Lynx Debug Bundle loaded!');
  if (typeof window.__LYNX_SET_BUNDLE_FORMAT__ === 'function') {
    window.__LYNX_SET_BUNDLE_FORMAT__(window.__LYNX_BUNDLE_FORMAT__);
  }
  
  // Create a debug UI to confirm the bundle loaded
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '20px';
  container.style.left = '20px';
  container.style.right = '20px';
  container.style.padding = '20px';
  container.style.backgroundColor = '#efefef';
  container.style.borderRadius = '8px';
  container.style.fontFamily = 'system-ui, sans-serif';
  container.style.zIndex = '999';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Vue Lynx Debug Bundle';
  heading.style.color = '#333';
  heading.style.margin = '0 0 10px 0';
  
  const infoText = document.createElement('p');
  infoText.textContent = 'Bundle loaded successfully at ' + new Date().toLocaleTimeString();
  infoText.style.color = '#666';
  
  container.appendChild(heading);
  container.appendChild(infoText);
  document.body.appendChild(container);
});
`;

// Convert the debug content to a buffer
const debugBuffer = Buffer.from(debugContent, 'utf8');

// Write the output file (simple text-based format for now)
fs.writeFileSync(outputBundlePath, contentBuffer);

// Create a debug bundle without any binary headers
const debugDir = path.resolve(distDir, 'debug');
if (!fs.existsSync(debugDir)) {
	fs.mkdirSync(debugDir, { recursive: true });
}
const debugBundlePath = path.resolve(debugDir, 'simple.lynx.bundle');
fs.writeFileSync(debugBundlePath, debugBuffer);

// Also create a JSON version that might be more compatible
const jsonBundlePath = path.resolve(debugDir, 'lynx-bundle.json');
const jsonBundle = {
	metadata: bundleMetadata,
	content: debugContent
};
fs.writeFileSync(jsonBundlePath, JSON.stringify(jsonBundle, null, 2));

// Also copy to static directory for serving
const staticDir = path.resolve(distDir, 'static');
const staticBundlePath = path.resolve(staticDir, 'main.lynx.bundle');
if (fs.existsSync(staticDir)) {
	fs.copyFileSync(outputBundlePath, staticBundlePath);
	console.log(`Also copied bundle to ${staticBundlePath} for serving`);

	// Copy debug bundles to static folder too
	fs.copyFileSync(
		debugBundlePath,
		path.resolve(staticDir, 'simple.lynx.bundle')
	);
	fs.copyFileSync(jsonBundlePath, path.resolve(staticDir, 'lynx-bundle.json'));
	console.log(`Also copied debug bundles to static directory`);
}

console.log(`\nBundle Summary:`);
console.log(`Successfully created text-based bundles using JSON format`);
console.log(
	`Main bundle at: ${outputBundlePath} (${contentBuffer.length} bytes)`
);
console.log(
	`Debug bundle at: ${debugBundlePath} (${debugBuffer.length} bytes)`
);
console.log(`JSON bundle at: ${jsonBundlePath}`);
console.log(
	`\nTry loading these in the Lynx Explorer app in the iOS simulator.`
);
