/**
 * Background Thread Loader for Vue-Lynx
 *
 * This loader marks modules to be executed in the background thread.
 * It transforms imports to ensure proper thread separation.
 */

import { threadMarker } from './thread-marker.js';

/**
 * Background thread loader that ensures the code runs in the worker thread
 * @param {string} source - The source code
 * @returns {string} - Transformed source code
 */
export default function backgroundLoader(source: string): string {
	// Mark this module for the background thread
	this.Layer = this.query.layer || 'vue-background';

	// Add the thread marker to the code
	const marker = threadMarker.generateBackgroundMarker();
	return `${marker}\n${source}`;
}
