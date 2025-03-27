import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import url, { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const PORT = 3471;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;

	console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

	// Handle bundle requests
	if (pathname === '/simple.lynx.bundle') {
		const bundlePath = path.resolve(distDir, 'debug/simple.lynx.bundle');
		serveBundle(res, bundlePath, 'application/octet-stream');
	} else if (pathname === '/main.lynx.bundle') {
		const bundlePath = path.resolve(distDir, 'main.lynx.bundle');
		serveBundle(res, bundlePath, 'application/octet-stream');
	} else if (pathname === '/alt1.lynx.bundle') {
		const bundlePath = path.resolve(distDir, 'debug/alt1.lynx.bundle');
		serveBundle(res, bundlePath, 'application/octet-stream');
	} else if (pathname === '/alt2.lynx.bundle') {
		const bundlePath = path.resolve(distDir, 'debug/alt2.lynx.bundle');
		serveBundle(res, bundlePath, 'application/octet-stream');
	} else if (pathname === '/simple.debug.js') {
		const bundlePath = path.resolve(distDir, 'debug/simple.debug.js');
		serveBundle(res, bundlePath, 'application/javascript');
	} else {
		// Serve index page with links
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`
      <html>
        <head>
          <title>Lynx Bundle Debug Server</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { margin: 10px 0; padding: 10px; background: #f4f4f4; border-radius: 4px; }
            a { color: #0066cc; text-decoration: none; display: block; }
            a:hover { text-decoration: underline; }
            .qr { margin-top: 20px; }
            .note { background-color: #fffbd0; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Lynx Bundle Debug Server</h1>
          <p>Choose a bundle format to test in the iOS Simulator:</p>
          
          <div class="note">
            <p><strong>Debugging Note:</strong> If you're seeing a size mismatch error in the Lynx Explorer app, 
            try each of these formats - they use different header formats and may help identify what works.</p>
          </div>
          
          <ul>
            <li>
              <a href="http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true">
                Main Bundle (32-byte header)
              </a>
              <div>Full URL: http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
            <li>
              <a href="http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true">
                Simple Debug Bundle (32-byte header)
              </a>
              <div>Full URL: http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
            <li>
              <a href="http://localhost:${PORT}/alt1.lynx.bundle?platform=ios&fullscreen=true">
                Alternative 1 (44-byte header, Big-Endian size)
              </a>
              <div>Full URL: http://localhost:${PORT}/alt1.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
            <li>
              <a href="http://localhost:${PORT}/alt2.lynx.bundle?platform=ios&fullscreen=true">
                Alternative 2 (44-byte header, Little-Endian size)
              </a>
              <div>Full URL: http://localhost:${PORT}/alt2.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
            <li>
              <a href="http://localhost:${PORT}/simple.debug.js?platform=ios&fullscreen=true">
                Plain JavaScript (no binary header)
              </a>
              <div>Full URL: http://localhost:${PORT}/simple.debug.js?platform=ios&fullscreen=true</div>
            </li>
          </ul>
          
          <div class="qr">
            <p>External IP Access:</p>
            <pre>IP Address: ${getLocalIpAddress()}</pre>
            <p>External URLs:</p>
            <ul>
              <li>http://${getLocalIpAddress()}:${PORT}/alt1.lynx.bundle?platform=ios&fullscreen=true</li>
              <li>http://${getLocalIpAddress()}:${PORT}/alt2.lynx.bundle?platform=ios&fullscreen=true</li>
            </ul>
          </div>
        </body>
      </html>
    `);
	}
});

function serveBundle(res, bundlePath, contentType) {
	if (!fs.existsSync(bundlePath)) {
		res.writeHead(404);
		res.end('Bundle not found');
		return;
	}

	const bundle = fs.readFileSync(bundlePath);
	console.log(`Serving bundle: ${bundlePath}`);
	console.log(`Bundle size: ${bundle.length} bytes`);

	// Dump the first 32 bytes in hex for debugging
	if (bundle.length >= 32) {
		const headerHex = bundle.slice(0, 32).toString('hex');
		console.log(`Header (first 32 bytes): ${headerHex}`);

		// Try to interpret the size from the header
		if (bundle.length >= 12) {
			const sizeLE = bundle.readUInt32LE(8);
			console.log(`Size from header (LE): ${sizeLE}`);
			if (bundle.length >= 48) {
				const sizeLE2 = bundle.readUInt32LE(20);
				const sizeBE2 = bundle.readUInt32BE(20);
				console.log(`Size at offset 20 (LE): ${sizeLE2}, (BE): ${sizeBE2}`);
			}
		}
	}

	// Set headers that might help with Lynx Explorer compatibility
	res.writeHead(200, {
		'Content-Type': contentType,
		'Content-Length': bundle.length,
		'Access-Control-Allow-Origin': '*',
		'X-Lynx-Bundle-Type': 'vue',
		'X-Lynx-Engine-Version': '1.4.0',
		'X-Lynx-Platform': 'ios',
		'Cache-Control': 'no-cache, no-store, must-revalidate'
	});

	res.end(bundle);
}

function getLocalIpAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}
	return 'localhost';
}

// Start the server
server.listen(PORT, () => {
	console.log(`\n🚀 Debug Server running at http://localhost:${PORT}`);
	console.log(`External URL: http://${getLocalIpAddress()}:${PORT}\n`);
	console.log(`Available bundle formats to test:`);
	console.log(
		`1. Main bundle: http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`2. Simple debug: http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`3. Alt1 (BE): http://localhost:${PORT}/alt1.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`4. Alt2 (LE): http://localhost:${PORT}/alt2.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`5. Plain JS: http://localhost:${PORT}/simple.debug.js?platform=ios&fullscreen=true\n`
	);
	console.log(
		`Try each format in the LynxExplorer app to see which one works!\n`
	);
});
