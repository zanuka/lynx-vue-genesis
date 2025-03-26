// Import our Vue Webpack Plugin
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { LAYERS, VueWebpackPlugin } from './vue-webpack-plugin.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the Vue Loader Plugin
let VueLoaderPlugin;
try {
	const VueLoader = require('vue-loader');
	VueLoaderPlugin = VueLoader.VueLoaderPlugin;
} catch (e) {
	console.warn('Vue Loader not found, trying to use the one from @rsbuild/plugin-vue');
	try {
		const RsbuildVuePlugin = require('@rsbuild/plugin-vue');
		VueLoaderPlugin = RsbuildVuePlugin.VueLoaderPlugin;
	} catch (e) {
		console.error('Could not find VueLoaderPlugin. Make sure vue-loader is installed.');
		VueLoaderPlugin = class MockVueLoaderPlugin {
			apply() {
				// No-op
			}
		};
	}
}

/**
 * Plugin options for Vue Lynx integration in rspeedy
 */
class PluginVueLynxOptions {
	/**
	 * Whether to enable Vue's dev tools
	 */
	enableDevTools = false;

	/**
	 * Whether to enable Vue's SSR capabilities
	 */
	enableSSR = false;

	/**
	 * First screen timing - when to render the first screen
	 */
	firstScreenSyncTiming = 'immediately';

	/**
	 * Platform target (ios, android, etc.)
	 */
	platform = 'web';

	/**
	 * Custom element tags to register
	 */
	customElements = ['view', 'text', 'image', 'scroll-view'];
}

/**
 * A plugin for rspeedy that integrates Vue with Lynx
 *
 * @public
 */
export function pluginVueLynx(options = {}) {
	const pluginOptions = { ...new PluginVueLynxOptions(), ...options };

	return {
		name: 'plugin-vue-lynx',

		setup(api) {
			// Add loaders for Vue files
			api.modifyRsbuildConfig((config) => {
				config.source = config.source || {};
				config.source.alias = config.source.alias || {};

				// Add aliases for Vue-Lynx runtime
				config.source.alias['@vue-lynx/runtime'] = path.resolve(__dirname, '../runtime');

				return config;
			});

			// Configure the Vue loaders
			api.modifyBundlerChain((chain, { CHAIN_ID }) => {
				// Add Vue file extensions
				chain.resolve.extensions.add('.vue').add('.jsx').add('.tsx');

				// Configure Vue loader
				const vueRule = chain.module.rule(CHAIN_ID.RULE.VUE || 'vue');
				vueRule
					.test(/\.vue$/)
					.use('vue-loader')
					.loader('vue-loader')
					.options({
						compilerOptions: {
							isCustomElement: (tag) => pluginOptions.customElements.includes(tag),
						},
					});

				// Configure main thread Vue files
				const mainThreadRule = chain.module.rule('vue-lynx-main');
				mainThreadRule
					.test(/\.(jsx?|tsx?)$/)
					.include.add((resource) => {
						return (
							!resource.includes('node_modules') &&
							(resource.includes('components') ||
								resource.includes('views') ||
								resource.includes('pages'))
						);
					})
					.end()
					.use('main-thread-loader')
					.loader(VueWebpackPlugin.loaders.MAIN_THREAD)
					.options({
						layer: LAYERS.MAIN_THREAD,
					});

				// Configure background thread files
				const backgroundRule = chain.module.rule('vue-lynx-background');
				backgroundRule
					.test(/\.(jsx?|tsx?)$/)
					.include.add((resource) => {
						return (
							!resource.includes('node_modules') &&
							(resource.includes('store') ||
								resource.includes('services') ||
								resource.includes('api'))
						);
					})
					.end()
					.use('background-loader')
					.loader(VueWebpackPlugin.loaders.BACKGROUND)
					.options({
						layer: LAYERS.BACKGROUND,
						thread: 'background',
					});

				// Add type-checking if TypeScript is used
				try {
					require.resolve('typescript', { paths: [process.cwd()] });
					// Add TypeScript support
					chain.module
						.rule('ts')
						.test(/\.tsx?$/)
						.use('ts-loader')
						.loader('ts-loader')
						.options({
							transpileOnly: true,
							happyPackMode: true,
							appendTsSuffixTo: [/\.vue$/],
						});
				} catch (e) {
					// TypeScript not installed, skip
				}

				// Add Babel for JSX support - keeping it simple for now
				chain.module
					.rule('jsx')
					.test(/\.jsx?$/)
					.use('babel-loader')
					.loader('babel-loader')
					.options({
						// No special presets for now to avoid dependency issues
					});

				// Add the Vue Webpack Plugin
				chain.plugin('vue-webpack-plugin').use(VueWebpackPlugin, [
					{
						enableDevTools: pluginOptions.enableDevTools,
						enableSSR: pluginOptions.enableSSR,
						firstScreenSyncTiming: pluginOptions.firstScreenSyncTiming,
						mainThreadChunks: ['main.js', 'index.js', 'mobile.js'],
					},
				]);

				// Add the Vue Loader Plugin
				chain.plugin('vue-loader-plugin').use(VueLoaderPlugin);
			});

			// Add the platform target
			api.modifyRsbuildConfig((config) => {
				if (!config.environments) {
					config.environments = {};
				}

				// Set the platform-specific environment
				if (pluginOptions.platform === 'ios') {
					config.environments.ios = config.environments.ios || {};
				} else if (pluginOptions.platform === 'android') {
					config.environments.android = config.environments.android || {};
				} else {
					config.environments.web = config.environments.web || {};
				}

				return config;
			});
		},
	};
}

export { PluginVueLynxOptions };

VueWebpackPlugin.loaders = {
	BACKGROUND: path.resolve(__dirname, './vue-lynx-background.js'),
	MAIN_THREAD: path.resolve(__dirname, './vue-lynx-main-thread.js'),
};
