/**
 * Lynx Android build configuration
 */

import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVueLynx } from './loaders/vue-lynx-rspeedy-plugin.ts';

export default defineConfig({
	source: {
		entry: './src/lynx-main.ts', // Updated to match the same entry as iOS and web
		include: ['**/*.vue', '**/*.lynx', '**/*.jsx', '**/*.tsx', '**/*.ts'],
		exclude: ['node_modules/**'],
	},
	server: {
		port: 3002,
		host: '0.0.0.0',
	},
	output: {
		filename: '[name].js',
		assetPrefix: '/',
	},
	// Use our Vue Lynx plugin with platform set to Android
	plugins: [
		pluginVueLynx({
			platform: 'android',
			enableDevTools: true,
			firstScreenSyncTiming: 'immediately',
		}),
	],
	environments: {
		android: {},
	},
});
