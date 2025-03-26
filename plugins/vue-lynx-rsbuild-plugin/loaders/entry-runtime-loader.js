/**
 * Entry Runtime Loader for Vue Lynx
 *
 * This loader processes the entry file and generates the appropriate runtime code
 * for the Vue Lynx application, handling the synchronization between threads.
 */

const path = require('path');

module.exports = function (source) {
	// Make this loader cacheable
	this.cacheable && this.cacheable();

	const options = this.getOptions();
	const { entryName, entryOptions } = options;
	const { firstScreenSyncTiming = 'jsReady' } = entryOptions || {};

	// Generate runtime code for Vue Lynx entry
	return `
    // Original source
    ${source}
    
    // Vue Lynx runtime initialization
    import { initRuntime } from '@vue-lynx/runtime';
    
    // Initialize Vue Lynx runtime with the specified timing option
    initRuntime({
      firstScreenSyncTiming: '${firstScreenSyncTiming}',
      entryName: '${entryName}',
    });
  `;
};
