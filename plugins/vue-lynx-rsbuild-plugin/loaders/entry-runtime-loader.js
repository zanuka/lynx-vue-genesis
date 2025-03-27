const path = require('path');

module.exports = function (source) {
	this.cacheable && this.cacheable();

	const options = this.getOptions();
	const { entryName, entryOptions } = options;
	const { firstScreenSyncTiming = 'jsReady' } = entryOptions || {};

	return `
    ${source}
    
    import { initRuntime } from '@vue-lynx/runtime';
    
    initRuntime({
      firstScreenSyncTiming: '${firstScreenSyncTiming}',
      entryName: '${entryName}',
    });
  `;
};
