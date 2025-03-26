/**
 * Loaders configuration for Vue Lynx
 */
import type { RsbuildPluginAPI } from '@rsbuild/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginVueLynxOptions } from './index.js';
import { LAYERS } from './layers.js';

/**
 * Applies loaders configuration for Vue Lynx
 * This sets up the Vue-specific transformations for Lynx
 */
export function applyLoaders(api: RsbuildPluginAPI, options: Required<PluginVueLynxOptions>): void {
	const { enableDevTools } = options;
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	// Configure the Vue loader for Lynx
	api.modifyBundlerChain((chain, { target, CHAIN_ID, isProd }) => {
		// Configure Vue loader for both layers
		[LAYERS.MAIN_THREAD, LAYERS.BACKGROUND].forEach((layer) => {
			const vueLoaderOptions = {
				compilerOptions: {
					// Configure Vue compiler options for Lynx
					isCustomElement: (tag: string) => {
						// Treat Lynx-specific tags as custom elements
						return tag === 'view' || tag === 'text' || tag === 'image' || tag.startsWith('lynx-');
					},
					// Disable whitespace handling for better performance
					whitespace: 'preserve',
				},
				// Include source maps if not in production
				sourceMap: !isProd,
				// Enable hot reload for development
				hotReload: !isProd && enableDevTools,
				// Set the thread layer context
				threadContext: layer,
			};

			// Add Vue loader rule for this layer
			chain.module
				.rule(`vue-${layer}`)
				.test(/\.vue$/)
				.issuerLayer(layer)
				.use('vue-loader')
				.loader('vue-loader')
				.options(vueLoaderOptions)
				.end();
		});

		try {
			// Add Vue template compiler plugin
			const { VueLoaderPlugin } = require('vue-loader');
			chain.plugin('vue-loader-plugin')
				.use(VueLoaderPlugin)
				.end();

			// Check if LynxTemplatePlugin exists
			try {
				// Add Lynx template plugin for generating Lynx bundles
				const lynxTemplatePluginPath = require.resolve('@lynx-js/vue-template-plugin', { paths: [api.context.rootPath] });
				const LynxTemplatePlugin = require(lynxTemplatePluginPath);
				chain.plugin('lynx-template-plugin')
					.use(LynxTemplatePlugin, [{
						// Configure Lynx template plugin options
						babelPresets: [
							[
								'@babel/preset-env',
								{
									modules: false,
									targets: {
										chrome: '70',
									},
								},
							],
						],
						// Add custom transformers for Lynx compatibility
						transformers: [
							// Add any Lynx-specific transformers here
						],
					}])
					.end();
			} catch (e) {
				console.warn('Lynx template plugin not found. Using standard Vue build.', e);
			}
		} catch (e) {
			console.error('Error loading Vue plugins:', e);
		}
	});
} 
