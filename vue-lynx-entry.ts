/**
 * Vue-Lynx Integration
 *
 * This file serves as the main entry point for the Vue-Lynx integration package.
 * It exports all necessary components for using Vue with Lynx.
 */

import type { App, Component } from 'vue';

// Export the rspeedy plugin
export {
	pluginVueLynx,
	PluginVueLynxOptions
} from './loaders/vue-lynx-rspeedy-plugin.js';

// Export the webpack plugin
export {
	LAYERS,
	VueWebpackPlugin,
	VueWebpackPluginOptions
} from './loaders/vue-webpack-plugin.js';

// Export runtime adapters
export { initVueLynxAdapter, patchVueRuntime } from './runtime/index.js';
export {
	useBackgroundThread,
	useMainThread
} from './runtime/thread-communication.js';

interface LynxPluginOptions {
	components?: Component[];
}

/**
 * Plugin for Vue that registers Lynx-specific components
 */
export const LynxPlugin = {
	/**
	 * Install the plugin into a Vue application
	 * @param {App} app - The Vue application
	 * @param {LynxPluginOptions} options - Plugin options
	 */
	install(app: App, options: LynxPluginOptions = {}) {
		// Register Lynx-specific components
		const components = options.components || [];

		// Register global components
		components.forEach((component) => {
			if ('name' in component && typeof component.name === 'string') {
				app.component(component.name, component);
			}
		});

		// Register built-in Lynx components for each platform
		const builtInComponents = [
			{ name: 'view' },
			{ name: 'text' },
			{ name: 'image' },
			{ name: 'scroll-view' }
		];

		builtInComponents.forEach(({ name }) => {
			app.component(name, {
				name,
				render() {
					return this.$slots.default ? this.$slots.default() : null;
				}
			});
		});

		// Initialize the Vue-Lynx adapter
		// Import dynamically to avoid circular dependencies
		import('./runtime/index.js')
			.then(({ initVueLynxAdapter }) => {
				if (typeof initVueLynxAdapter === 'function') {
					initVueLynxAdapter();
				}
			})
			.catch((err) => {
				console.warn('Failed to initialize Vue-Lynx adapter:', err);
			});
	}
};

/**
 * Composable for detecting the current Lynx platform
 *
 * @returns {string} The current platform ('ios', 'android', or 'web')
 *
 * @example
 * ```js
 * import { useLynxPlatform } from '@lynx-js/vue-plugin';
 *
 * export default {
 *   setup() {
 *     const platform = useLynxPlatform();
 *     return { platform };
 *   }
 * }
 * ```
 */
export function useLynxPlatform(): 'ios' | 'android' | 'web' {
	// Detect the platform
	// Check for global lynx object
	if (
		typeof window !== 'undefined' &&
		'lynx' in window &&
		typeof (window as any).lynx?.platform === 'string'
	) {
		return (window as any).lynx.platform as 'ios' | 'android' | 'web';
	}

	// Fallback to user agent detection for web
	if (typeof navigator !== 'undefined') {
		const userAgent = navigator.userAgent || '';

		if (userAgent.includes('Android')) {
			return 'android';
		} else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
			return 'ios';
		}
	}

	return 'web';
}
