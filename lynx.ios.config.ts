import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';

export default defineConfig({
	source: {
		entry: {
			main: './src/lynx-basic.ts',
		},
		include: ['**/*.ts'],
		exclude: ['node_modules/**'],
	},
	server: {
		port: 3470,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	output: {
		filename: '[name].lynx.bundle',
		distPath: {
			root: 'dist',
			js: '',
		},
		filenameHash: false,
		copy: [
			{
				from: 'public',
				to: 'static',
			},
			{
				from: 'src/assets',
				to: 'static',
			},
		],
	},
	tools: {
		rspack: {
			optimization: {
				runtimeChunk: false,
				splitChunks: false,
			},
			output: {
				filename: '[name].lynx.bundle',
			},
		},
	},
	plugins: [
		pluginQRCode({
			schema(url) {
				return `${url}?fullscreen=true`;
			},
		}),
	],
	environments: {
		ios: {},
	},
});
