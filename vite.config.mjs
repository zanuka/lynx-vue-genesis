import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import viteLynxPlugin from './vite-lynx-plugin.js';

// Use Vue plugin with custom elements support
export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// Treat any tag that starts with 'lynx-' as custom elements
					// Also treat common Lynx elements as custom elements
					isCustomElement: (tag) =>
						tag.startsWith('lynx-') || ['view', 'text'].includes(tag)
				}
			}
		}),
		svgLoader(),
		viteLynxPlugin()
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		port: 3000,
		host: '127.0.0.1',
		open: '/lynx.html',
		hmr: {
			// Disable HMR overlay to prevent error popups
			overlay: false
		}
	},
	// Add Lynx worker management
	worker: {
		format: 'es',
		plugins: [vue()]
	},
	build: {
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
				lynx: path.resolve(__dirname, 'lynx.html')
			}
		}
	}
	// Vite automatically serves files from the public directory, so we don't need to specify it
});
