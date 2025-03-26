/**
 * Simple Vue Lynx configuration for Rsbuild
 */
const { defineConfig } = require('@lynx-js/rspeedy');
const { pluginVue } = require('@rsbuild/plugin-vue');

module.exports = defineConfig({
	source: {
		entry: {
			main: './src/lynx-main.ts'
		},
		include: ['**/*.vue', '**/*.ts'],
		exclude: ['node_modules/**']
	},
	server: {
		port: 3470,
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
		filenameHash: false
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
			}
		}
	},
	plugins: [pluginVue()],
	environments: {
		ios: {}
	}
});
