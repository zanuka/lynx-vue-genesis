import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple placeholder Lynx plugin for Vite
export default function viteLynxPlugin() {
	return {
		name: 'vite-lynx-plugin',

		// Transform Vue SFCs - simplified version without imports
		transform(code, id) {
			// Only process .vue files that have Lynx in the name
			if (
				!id.endsWith('.vue') ||
				(!id.includes('Lynx') && !id.includes('lynx'))
			) {
				return null;
			}

			console.log(`Processing Lynx component: ${path.relative(__dirname, id)}`);

			// Just pass through the code without transformations
			return null;
		},

		// Handle asset serving
		configureServer(server) {
			// Simple pass-through middleware
			server.middlewares.use((req, res, next) => {
				next();
			});
		},

		// Simple config that doesn't do anything special
		config(config) {
			return config;
		}
	};
}
