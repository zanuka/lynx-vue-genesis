import type { App, Component } from 'vue';

export {
	pluginVueLynx,
	PluginVueLynxOptions
} from './loaders/vue-lynx-rspeedy-plugin.js';

export {
	LAYERS,
	VueWebpackPlugin,
	VueWebpackPluginOptions
} from './loaders/vue-webpack-plugin.js';

export { initVueLynxAdapter, patchVueRuntime } from './runtime/index.js';
export {
	useBackgroundThread,
	useMainThread
} from './runtime/thread-communication.js';

interface LynxPluginOptions {
	components?: Component[];
}

export const LynxPlugin = {
	install(app: App, options: LynxPluginOptions = {}) {
		const components = options.components || [];

		components.forEach((component) => {
			if ('name' in component && typeof component.name === 'string') {
				app.component(component.name, component);
			}
		});

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

export function useLynxPlatform(): 'ios' | 'android' | 'web' {
	if (
		typeof window !== 'undefined' &&
		'lynx' in window &&
		typeof (window as any).lynx?.platform === 'string'
	) {
		return (window as any).lynx.platform as 'ios' | 'android' | 'web';
	}

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
