/**
 * Simple Vue Lynx configuration for Rsbuild
 */
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginVue } from '@rsbuild/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	source: {
		entry: {
			main: './src/lynx-main.ts'
		},
		include: ['**/*.vue', '**/*.ts'],
		exclude: ['node_modules/**']
	},
	server: {
		port: 3000,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	output: {
		filename: '[name].lynx.bundle',
		distPath: {
			root: 'dist/vue-lynx',
			js: ''
		},
		filenameHash: false,
		copy: [
			{
				from: path.resolve(__dirname, 'vue-lynx-entry.js'),
				to: ''
			},
			{
				from: 'public',
				to: 'static'
			}
		]
	},
	tools: {
		rspack: {
			optimization: {
				runtimeChunk: false,
				splitChunks: false
			},
			output: {
				filename: '[name].lynx.bundle',
				chunkFilename: '[name].lynx.bundle'
			},
			resolve: {
				alias: {
					'@runtime': path.resolve(__dirname, 'runtime')
				}
			}
		}
	},
	plugins: [
		pluginVue(),
		pluginQRCode({
			schema(url) {
				// Open the page in LynxExplorer in full screen mode
				return `${url}?fullscreen=true`;
			}
		})
	],
	environments: {
		ios: {} // Only iOS environment
	}
});
