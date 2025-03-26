import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import viteLynxPlugin from './vite-lynx-plugin.ts';

export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
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
		hmr: {
			overlay: false
		}
	},
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
});
