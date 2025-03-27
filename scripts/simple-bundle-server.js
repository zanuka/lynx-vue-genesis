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
		serveBundle(res, bundlePath);
	} else if (pathname === '/main.lynx.bundle') {
		const bundlePath = path.resolve(distDir, 'main.lynx.bundle');
		serveBundle(res, bundlePath);
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
          </style>
        </head>
        <body>
          <h1>Lynx Bundle Debug Server</h1>
          <p>Choose a bundle to test in the iOS Simulator:</p>
          <ul>
            <li>
              <a href="http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true">
                Main Bundle
              </a>
              <div>Full URL: http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
            <li>
              <a href="http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true">
                Simple Test Bundle
              </a>
              <div>Full URL: http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true</div>
            </li>
          </ul>
          <div class="qr">
            <p>External IP Access:</p>
            <pre>IP Address: ${getLocalIpAddress()}</pre>
            <p>External URL: http://${getLocalIpAddress()}:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true</p>
          </div>
        </body>
      </html>
    `);
	}
});

function serveBundle(res, bundlePath) {
	if (!fs.existsSync(bundlePath)) {
		res.writeHead(404);
		res.end('Bundle not found');
		return;
	}

	const bundle = fs.readFileSync(bundlePath);
	console.log(`Serving bundle: ${bundlePath}`);
	console.log(`Bundle size: ${bundle.length} bytes`);

	// Set headers that might help with Lynx Explorer compatibility
	res.writeHead(200, {
		'Content-Type': 'application/octet-stream',
		'Content-Length': bundle.length,
		'Content-Disposition': 'attachment; filename="bundle.lynx.bundle"',
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
	console.log(`Available bundles:`);
	console.log(
		`- Main bundle: http://localhost:${PORT}/main.lynx.bundle?platform=ios&fullscreen=true`
	);
	console.log(
		`- Simple test bundle: http://localhost:${PORT}/simple.lynx.bundle?platform=ios&fullscreen=true\n`
	);
});
