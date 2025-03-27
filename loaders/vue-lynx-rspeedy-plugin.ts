import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { LAYERS, VueWebpackPlugin } from './vue-webpack-plugin.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

class PluginVueLynxOptions {
	enableDevTools = false;
	enableSSR = false;
	firstScreenSyncTiming = 'immediately';
	platform = 'web';
	customElements = ['view', 'text', 'image', 'scroll-view'];
}

export function pluginVueLynx(options = {}) {
	const pluginOptions = { ...new PluginVueLynxOptions(), ...options };

	return {
		name: 'plugin-vue-lynx',

		setup(api) {
			api.modifyRsbuildConfig((config) => {
				config.source = config.source || {};
				config.source.alias = config.source.alias || {};

				config.source.alias['@vue-lynx/runtime'] = path.resolve(__dirname, '../runtime');

				return config;
			});

			api.modifyBundlerChain((chain, { CHAIN_ID }) => {
				chain.resolve.extensions.add('.vue').add('.jsx').add('.tsx');

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

				try {
					require.resolve('typescript', { paths: [process.cwd()] });
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

				chain.module
					.rule('jsx')
					.test(/\.jsx?$/)
					.use('babel-loader')
					.loader('babel-loader')
					.options({
						// No special presets for now to avoid dependency issues
					});

				chain.plugin('vue-webpack-plugin').use(VueWebpackPlugin, [
					{
						enableDevTools: pluginOptions.enableDevTools,
						enableSSR: pluginOptions.enableSSR,
						firstScreenSyncTiming: pluginOptions.firstScreenSyncTiming,
						mainThreadChunks: ['main.js', 'index.js', 'mobile.js'],
					},
				]);

				chain.plugin('vue-loader-plugin').use(VueLoaderPlugin);
			});

			api.modifyRsbuildConfig((config) => {
				if (!config.environments) {
					config.environments = {};
				}

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
