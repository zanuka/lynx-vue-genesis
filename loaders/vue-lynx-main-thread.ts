/**
 * Main Thread Loader for Vue-Lynx
 *
 * This loader marks modules to be executed in the main thread.
 * It also transforms imports to ensure proper thread separation.
 */

import { threadMarker } from './thread-marker.js';

/**
 * Main thread loader that ensures the code runs in the UI thread
 * @param {string} source - The source code
 * @returns {string} - Transformed source code
 */
export default function mainThreadLoader(source: string): string {
	// Mark this module for the main thread
	this.Layer = this.query.layer || 'vue-main-thread';

	// Add the thread marker to the code
	const marker = threadMarker.generateMainThreadMarker();
	return `${marker}\n${source}`;
}
