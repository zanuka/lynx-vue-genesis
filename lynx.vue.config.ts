/**
 * Vue Lynx build configuration
 */
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVueLynx } from './plugins/vue-lynx-rsbuild-plugin/index.js';

export default defineConfig({
	source: {
		entry: {
			main: './src/lynx-main.ts',
		},
		include: ['**/*.vue', '**/*.ts'],
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
				// Completely disable code splitting
				runtimeChunk: false,
				splitChunks: false,
			},
			output: {
				// Override rspack output to use .lynx.bundle extension
				filename: '[name].lynx.bundle',
			},
		},
	},
	plugins: [
		// Add our custom Vue Lynx plugin
		pluginVueLynx({
			enableCSSSelector: true,
			enableParallelElement: true,
			firstScreenSyncTiming: 'immediately',
			enableDevTools: true,
		}),
		pluginQRCode({
			schema(url) {
				// Open the page in LynxExplorer in full screen mode
				return `${url}?fullscreen=true`;
			},
		}),
	],
	environments: {
		ios: {}, // Only iOS environment
	},
}); 
