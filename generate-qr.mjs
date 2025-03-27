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
const bundlePath = 'alt1.lynx.bundle'; // Using the alt1 bundle which has a 44-byte header with BE size
const fullUrl = `http://${ipAddress}:${port}/${bundlePath}?platform=ios&fullscreen=true`;

console.log(`\n📱 Lynx QR Code Generator - Debug Bundle Formats 📱\n`);
console.log(`Local IP: ${ipAddress}`);
console.log(`Port: ${port}`);
console.log(`Primary URL (generating QR code for this): ${fullUrl}\n`);

console.log('Scan this QR code with your device:');
qrcode.generate(fullUrl, { small: false });

console.log(`\nOr manually enter any of these URLs in the LynxExplorer app:\n`);
console.log(`Available bundle formats to test:`);
console.log(`1. Main app bundle (32-byte header):`);
console.log(
	`   http://${ipAddress}:${port}/main.lynx.bundle?platform=ios&fullscreen=true`
);

console.log(`\n2. Simple debug bundle (32-byte header):`);
console.log(
	`   http://${ipAddress}:${port}/simple.lynx.bundle?platform=ios&fullscreen=true`
);

console.log(`\n3. Alternative 1 bundle (44-byte header, Big-Endian size):`);
console.log(
	`   http://${ipAddress}:${port}/alt1.lynx.bundle?platform=ios&fullscreen=true`
);

console.log(`\n4. Alternative 2 bundle (44-byte header, Little-Endian size):`);
console.log(
	`   http://${ipAddress}:${port}/alt2.lynx.bundle?platform=ios&fullscreen=true`
);

console.log(`\n5. Plain JavaScript bundle (no binary header):`);
console.log(
	`   http://${ipAddress}:${port}/simple.debug.js?platform=ios&fullscreen=true`
);

console.log(`\nDebug server options page:`);
console.log(`   http://${ipAddress}:${port}/`);

console.log(
	`\nTry each format to find which one works in the LynxExplorer app.\n`
);
