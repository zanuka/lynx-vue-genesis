import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [vue()],
	test: {
		// Node.js environment with JSDOM
		environment: 'jsdom',
		// Global variables
		globals: true,
		// Setup files run before each test file
		setupFiles: ['./test/vitest-setup.ts'],
		// Faster execution with timeout values
		testTimeout: 20000,
		hookTimeout: 20000,
		// Run tests in a single process (avoids worker issues)
		pool: 'vmThreads',
		// Limit concurrency (replaces maxThreads/minThreads)
		maxWorkers: 1,
		minWorkers: 1,
		// Only focus on component tests
		include: [
			'src/components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
		],
		// Files to exclude
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/*'],
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './coverage'
		},
		// Mock all browser APIs
		environmentOptions: {
			jsdom: {
				// Silent JSDOM
				resources: 'usable',
				// Don't fetch external resources
				url: 'http://localhost'
			}
		},
		// Don't isolate test files
		isolate: false,
		// Specify sequence for tests
		sequence: {
			// Run tests in order of definition
			shuffle: false
		},
		// Immediately fail on first error
		bail: 1
	}
});
