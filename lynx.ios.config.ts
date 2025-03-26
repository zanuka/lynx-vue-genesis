/**
 * Lynx iOS build configuration
 */

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
	source: {
		entry: {
			main: './src/lynx-main.ts',
		},
		include: ['**/*.vue', '**/*.lynx', '**/*.jsx', '**/*.tsx', '**/*.ts'],
		exclude: ['node_modules/**'],
	},
	server: {
		port: 3000,
		host: '192.168.9.103',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	output: {
		filename: '[name].lynx.bundle',
		assetPrefix: '/',
		distPath: {
			root: 'dist',
			js: '',
		},
		filenameHash: false,
	},
	plugins: [
		pluginQRCode({
			schema(url) {
				// We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
				return `${url}?fullscreen=true`;
			},
		}),
		pluginVue({
			vueLoaderOptions: {
				compilerOptions: {
					isCustomElement: (tag) => ['view', 'text', 'image', 'scroll-view'].includes(tag),
				},
			},
		}),
	],
	environments: {
		ios: {},
	},
});
