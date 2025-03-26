import { execSync } from 'child_process';
import { networkInterfaces } from 'os';
import qrcode from 'qrcode-terminal';

// Get the local IP address
function getLocalIpAddress() {
	const nets = networkInterfaces();
	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
	return '127.0.0.1'; // Fallback to localhost
}

// Try to detect the port used by rspeedy
function detectRspeedyPort() {
	try {
		// Get the list of listening ports used by rspeedy process
		const result = execSync(
			"lsof -i -P | grep rspeedy | grep LISTEN | awk '{print $9}'"
		)
			.toString()
			.trim();
		if (result) {
			// Extract port number from something like "localhost:3002" or "*:3002"
			const portMatch = result.match(/:(\d+)/);
			if (portMatch && portMatch[1]) {
				return parseInt(portMatch[1], 10);
			}
		}
	} catch (error) {
		console.log('Could not detect rspeedy port, using default');
	}
	return 3000; // Default port
}

const ipAddress = getLocalIpAddress();
const port = detectRspeedyPort(); // Dynamically detect port
const bundlePath = 'main.lynx.bundle';
const fullUrl = `http://${ipAddress}:${port}/${bundlePath}?fullscreen=true`;

console.log(`\n📱 Lynx QR Code Generator 📱\n`);
console.log(`Local IP: ${ipAddress}`);
console.log(`Port: ${port}`);
console.log(`URL: ${fullUrl}\n`);

// Generate QR code
console.log('Scan this QR code with your device:');
qrcode.generate(fullUrl, { small: false });

console.log(`\nOr manually enter the URL in your Lynx-compatible app.\n`);
