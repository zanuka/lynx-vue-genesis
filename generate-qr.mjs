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

const ipAddress = getLocalIpAddress();
const port = 3471;
const bundlePath = 'simple.lynx.bundle';
const fullUrl = `http://${ipAddress}:${port}/${bundlePath}?platform=ios&fullscreen=true`;

console.log(`\n📱 Lynx QR Code Generator 📱\n`);
console.log(`Local IP: ${ipAddress}`);
console.log(`Port: ${port}`);
console.log(`URL: ${fullUrl}\n`);

console.log('Scan this QR code with your device:');
qrcode.generate(fullUrl, { small: false });

console.log(`\nOr manually enter the URL in your Lynx-compatible app.\n`);
console.log(`Additional bundles available at:`);
console.log(
	`- Debug UI: http://${ipAddress}:${port}/simple.lynx.bundle?platform=ios&fullscreen=true`
);
console.log(
	`- Main App: http://${ipAddress}:${port}/main.lynx.bundle?platform=ios&fullscreen=true`
);
console.log(
	`- JSON Version: http://${ipAddress}:${port}/lynx-bundle.json?platform=ios&fullscreen=true`
);
console.log(`\nAccess debug options at: http://${ipAddress}:${port}/\n`);
