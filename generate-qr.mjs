import { execSync } from 'child_process';
import { networkInterfaces } from 'os';
import qrcode from 'qrcode-terminal';

function getLocalIpAddress() {
	const nets = networkInterfaces();
	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
	return '127.0.0.1';
}

function detectRspeedyPort() {
	try {
		const result = execSync(
			"lsof -i -P | grep rspeedy | grep LISTEN | awk '{print $9}'"
		)
			.toString()
			.trim();
		if (result) {
			const portMatch = result.match(/:(\d+)/);
			if (portMatch && portMatch[1]) {
				console.log(`Detected Rspeedy server running on port ${portMatch[1]}`);
				return parseInt(portMatch[1], 10);
			}
		}
	} catch (error) {
		console.log(
			'Could not detect rspeedy port, checking for default port availability'
		);
	}

	try {
		const inUseResult = execSync('lsof -i :3000 | grep LISTEN')
			.toString()
			.trim();
		if (!inUseResult) {
			console.log('Default port 3000 appears available');
			return 3000;
		} else {
			console.log('Default port 3000 is in use, checking 3001');
			const port3001Result = execSync('lsof -i :3001 | grep LISTEN')
				.toString()
				.trim();
			if (!port3001Result) {
				console.log('Port 3001 appears available');
				return 3001;
			} else {
				console.log('Using port 3002 as fallback');
				return 3002;
			}
		}
	} catch (error) {
		console.log('Default port check failed, using 3000 as fallback');
		return 3000;
	}
}

const ipAddress = getLocalIpAddress();
const port = detectRspeedyPort();
const bundlePath = 'main.lynx.bundle';
const fullUrl = `http://${ipAddress}:${port}/${bundlePath}?fullscreen=true`;

console.log(`\n📱 Lynx QR Code Generator 📱\n`);
console.log(`Local IP: ${ipAddress}`);
console.log(`Port: ${port}`);
console.log(`URL: ${fullUrl}\n`);

console.log('Scan this QR code with your device:');
qrcode.generate(fullUrl, { small: false });

console.log(`\nOr manually enter the URL in your Lynx-compatible app.\n`);
