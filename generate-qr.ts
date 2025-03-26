#!/usr/bin/env node

/**
 * Simple QR code generator for Lynx bundles
 * Based on the implementation in @lynx-js/qrcode-rsbuild-plugin
 */

// Using dynamic imports for ES modules compatibility
async function main() {
	// Dynamically import the required modules
	const QRCode = (await import('qrcode-terminal')).default;
	const os = await import('os');

	// Get network interfaces to find the IP address
	const getLocalIp = (): string => {
		const interfaces = os.networkInterfaces();
		for (const name of Object.keys(interfaces)) {
			const networkInterfaces = interfaces[name];
			if (!networkInterfaces) continue;

			for (const iface of networkInterfaces) {
				// Skip over internal and non-ipv4 addresses
				if (iface.family !== 'IPv4' || iface.internal) {
					continue;
				}
				return iface.address;
			}
		}
		return '127.0.0.1';
	};

	// Configuration
	const port = 3001; // The port your server is running on
	const ipAddress = process.argv[2] || getLocalIp();
	const entryName = 'main';
	const fullscreen = true;

	// Generate the URL with the appropriate format
	const baseUrl = `http://${ipAddress}:${port}/${entryName}.lynx.bundle`;
	const fullUrl = fullscreen ? `${baseUrl}?fullscreen=true` : baseUrl;

	console.log(`\n\x1b[32mScan with Lynx\x1b[0m`);

	// Generate the QR code
	QRCode.generate(fullUrl, { small: true });

	console.log(`\n\x1b[32m${fullUrl}\x1b[0m\n`);
}

// Run the main function
main().catch((err) => {
	console.error('Error generating QR code:', err);
	process.exit(1);
});
