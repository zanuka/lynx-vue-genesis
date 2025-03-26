#!/usr/bin/env node

async function main() {
	const QRCode = (await import('qrcode-terminal')).default;
	const os = await import('os');
	const getLocalIp = (): string => {
		const interfaces = os.networkInterfaces();
		for (const name of Object.keys(interfaces)) {
			const networkInterfaces = interfaces[name];
			if (!networkInterfaces) continue;

			for (const iface of networkInterfaces) {
				if (iface.family !== 'IPv4' || iface.internal) {
					continue;
				}
				return iface.address;
			}
		}
		return '127.0.0.1';
	};

	const port = 3001;
	const ipAddress = process.argv[2] || getLocalIp();
	const entryName = 'main';
	const fullscreen = true;

	const baseUrl = `http://${ipAddress}:${port}/${entryName}.lynx.bundle`;
	const fullUrl = fullscreen ? `${baseUrl}?fullscreen=true` : baseUrl;

	console.log(`\n\x1b[32mScan with Lynx\x1b[0m`);

	QRCode.generate(fullUrl, { small: true });

	console.log(`\n\x1b[32m${fullUrl}\x1b[0m\n`);
}

main().catch((err) => {
	console.error('Error generating QR code:', err);
	process.exit(1);
});
