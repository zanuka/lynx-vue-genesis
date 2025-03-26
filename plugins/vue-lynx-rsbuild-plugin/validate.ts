/**
 * Validation for Vue Lynx plugin options
 */
import type { PluginVueLynxOptions } from './index.js';

/**
 * Validates the plugin options
 */
export function validateConfig(options?: PluginVueLynxOptions): void {
	if (!options) {
		return;
	}

	const allowedKeys = [
		'enableCSSSelector',
		'enableParallelElement',
		'firstScreenSyncTiming',
		'enableDevTools',
		'engineVersion',
	];

	// Check for unknown properties
	Object.keys(options).forEach(key => {
		if (!allowedKeys.includes(key)) {
			const errorMessage = `Unknown property: \`${key}\` in the configuration of pluginVueLynx`;
			console.warn(`[Vue Lynx Plugin] ${errorMessage}`);
		}
	});

	// Validate specific properties
	if (
		options.firstScreenSyncTiming !== undefined &&
		options.firstScreenSyncTiming !== 'immediately' &&
		options.firstScreenSyncTiming !== 'jsReady'
	) {
		console.warn(
			`[Vue Lynx Plugin] Invalid config on pluginVueLynx: \`firstScreenSyncTiming\` must be either 'immediately' or 'jsReady'.`
		);
	}
} 
