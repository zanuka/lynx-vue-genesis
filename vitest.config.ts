import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/vitest-setup.ts'],
		testTimeout: 20000,
		hookTimeout: 20000,
		pool: 'vmThreads',
		maxWorkers: 1,
		minWorkers: 1,
		include: [
			'src/components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
		],
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/*'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage'
		},
		environmentOptions: {
			jsdom: {
				resources: 'usable',
				url: 'http://localhost'
			}
		},
		isolate: false,
		sequence: {
			shuffle: false
		},
		bail: 1
	}
});
