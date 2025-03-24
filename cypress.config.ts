import { defineConfig } from 'cypress';

export default defineConfig({
	projectId: '8bbpap',
	component: {
		devServer: {
			framework: 'vue',
			bundler: 'vite'
		},
		specPattern: 'src/**/*.cy.{ts,tsx}',
		supportFile: 'cypress/support/component.ts'
	},
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: 'http://127.0.0.1:3000',
		specPattern: 'cypress/tests/**/*.cy.{ts,tsx}',
		supportFile: 'cypress/support/e2e.ts',
		viewportHeight: 1000,
		viewportWidth: 1280
	}
});
