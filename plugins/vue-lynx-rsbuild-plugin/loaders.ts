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
			// Use dynamic import to avoid require
			import('vue-loader').then(vueLoader => {
				const { VueLoaderPlugin } = vueLoader;
				chain.plugin('vue-loader-plugin')
					.use(VueLoaderPlugin)
					.end();
			}).catch(e => {
				console.error('Error loading vue-loader:', e);
			});

			// Skipping Lynx template plugin - not installed
			console.log('Note: @lynx-js/vue-template-plugin is not installed. Using standard Vue build.');

			// The following code is kept commented for reference but won't be executed
			/*
			// Check if LynxTemplatePlugin exists
			try {
				// Skip TypeScript checking for this import and use platform-specific dynamic loading
				// This matches Lynx's approach of conditionally loading platform modules
				const importPromise = Function('return import("@lynx-js/vue-template-plugin")')() as Promise<any>;

				importPromise.then(module => {
					const LynxTemplatePlugin = module.default || module;
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
				}).catch(e => {
					console.warn('Lynx template plugin not found. Using standard Vue build.', e);
				});
			} catch (e) {
				console.warn('Error importing Lynx template plugin:', e);
			}
			*/
		} catch (e) {
			console.error('Error loading Vue plugins:', e);
		}
	});
} 
