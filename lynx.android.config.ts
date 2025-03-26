import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVueLynx } from './loaders/vue-lynx-rspeedy-plugin.ts';

export default defineConfig({
	source: {
		entry: './src/lynx-main.ts',
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
