import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { LynxTemplatePlugin } from '@lynx-js/template-webpack-plugin';
import { RuntimeGlobals } from '@lynx-js/webpack-runtime-globals';

// We would define our own layers similar to React
const LAYERS = {
	BACKGROUND: 'vue-background',
	MAIN_THREAD: 'vue-main-thread',
};

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The options for VueWebpackPlugin
 *
 * @public
 */
class VueWebpackPluginOptions {
	/**
	 * Whether to enable lazy loading
	 */
	enableLazyLoading = false;

	/**
	 * Whether to enable Vue's SSR capabilities
	 */
	enableSSR = false;

	/**
	 * The chunk names to be considered as main thread chunks
	 */
	mainThreadChunks = [];

	/**
	 * First screen timing - when to render the first screen
	 */
	firstScreenSyncTiming = 'immediately'; // or 'jsReady'

	/**
	 * Whether to enable Vue's dev tools
	 */
	enableDevTools = false;
}

/**
 * Create a runtime module for Vue Lynx that handles evaluation results
 */
function createVueLynxProcessEvalResultRuntimeModule(webpack) {
	return class VueLynxProcessEvalResultRuntimeModule extends webpack.RuntimeModule {
		constructor() {
			super('vue lynx process eval result', webpack.RuntimeModule.STAGE_ATTACH);
		}

		generate() {
			const chunk = this.chunk;
			const compilation = this.compilation;

			if (!chunk || !compilation) {
				return '';
			}

			return `
// Vue Lynx Process Eval Result Runtime Module
${RuntimeGlobals.lynxProcessEvalResult} = function (result, schema) {
  var chunk = result(schema);
  if (chunk.ids && chunk.modules) {
    // We only deal with webpack chunk
    ${webpack.RuntimeGlobals.externalInstallChunk ? webpack.RuntimeGlobals.externalInstallChunk : '__webpack_require__.C'}(chunk);
    // Process modules in the chunk
    for (var moduleId in chunk.modules) {
      ${webpack.RuntimeGlobals.require ? webpack.RuntimeGlobals.require : '__webpack_require__'}(moduleId);
    }
    return chunk;
  }
  
  // Handle Vue component exports for non-webpack chunks
  if (typeof result === 'object' && result.__esModule && result.default && 
      (typeof result.default === 'object' || typeof result.default === 'function')) {
    return result.default;
  }
  return result;
};`;
		}
	};
}

/**
 * VueWebpackPlugin allows using Vue with Lynx via webpack
 *
 * @example
 * ```ts
 * // webpack.config.ts
 * import { VueWebpackPlugin } from './loaders/vue-webpack-plugin.ts'
 * export default {
 *   plugins: [new VueWebpackPlugin()],
 * }
 * ```
 *
 * @public
 */
class VueWebpackPlugin {
	/**
	 * The loaders for Vue-Lynx.
	 *
	 * @public
	 */
	static loaders = {
		BACKGROUND: path.resolve(process.cwd(), 'dist/loaders/vue-lynx-background.ts'),
		MAIN_THREAD: path.resolve(process.cwd(), 'dist/loaders/vue-lynx-main-thread.ts'),
	};

	/**
	 * Options for the plugin
	 */
	private options: VueWebpackPluginOptions;

	constructor(options = {}) {
		this.options = { ...new VueWebpackPluginOptions(), ...options };
	}

	/**
	 * The entry point of a webpack plugin.
	 * @param compiler - the webpack compiler
	 */
	apply(compiler) {
		const options = this.options;
		const { BannerPlugin, DefinePlugin, EnvironmentPlugin } = compiler.webpack;

		// Define entry banner if not using lazy loading
		if (!options.enableLazyLoading) {
			new BannerPlugin({
				banner: `'use strict';var globDynamicComponentEntry=globDynamicComponentEntry||'__Vue__';`,
				raw: true,
				test: options.mainThreadChunks,
			}).apply(compiler);
		}

		// Environment variables
		new EnvironmentPlugin({
			NODE_ENV: null,
			DEBUG: null,
		}).apply(compiler);

		// Define plugin for Vue-specific globals
		new DefinePlugin({
			__VUE_DEV_MODE__: JSON.stringify(compiler.options.mode === 'development'),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(options.enableDevTools),
			__ENABLE_SSR__: JSON.stringify(options.enableSSR),
			__FIRST_SCREEN_SYNC_TIMING__: JSON.stringify(options.firstScreenSyncTiming),
		}).apply(compiler);

		// Hook into the compilation process
		compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
			const onceForChunkSet = new WeakSet();

			// Set up runtime requirements
			compilation.hooks.runtimeRequirementInTree
				.for(compiler.webpack.RuntimeGlobals.ensureChunkHandlers)
				.tap('VueWebpackPlugin', (_, runtimeRequirements) => {
					runtimeRequirements.add(RuntimeGlobals.lynxProcessEvalResult);
				});

			// Add runtime module for main thread chunks
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.lynxProcessEvalResult)
				.tap('VueWebpackPlugin', (chunk) => {
					if (onceForChunkSet.has(chunk)) {
						return;
					}
					onceForChunkSet.add(chunk);

					if (chunk.name?.includes(':background')) {
						return;
					}

					const VueLynxProcessEvalResultRuntimeModule = createVueLynxProcessEvalResultRuntimeModule(
						compiler.webpack
					);
					compilation.addRuntimeModule(chunk, new VueLynxProcessEvalResultRuntimeModule());
				});

			// Process assets for main thread chunks
			compilation.hooks.processAssets.tap(
				{
					name: this.constructor.name,
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
				},
				() => {
					// Update main thread info for specified chunks
					for (const name of options.mainThreadChunks) {
						this._updateMainThreadInfo(compilation, name);
					}

					// Update main thread info for async chunks
					compilation.chunkGroups
						.filter((cg) => !cg.isInitial())
						.filter((cg) =>
							cg.origins.every((origin) => origin.module?.layer === LAYERS.MAIN_THREAD)
						)
						.forEach((cg) => {
							const files = cg.getFiles();
							files
								.filter((name) => name.endsWith('.ts'))
								.forEach((name) => this._updateMainThreadInfo(compilation, name));
						});
				}
			);

			// Hook into Lynx template plugin
			const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation);
			const { RawSource, ConcatSource } = compiler.webpack.sources;

			// Add Vue runtime if needed
			hooks.beforeEncode.tap(this.constructor.name, (args) => {
				const lepusCode = args.encodeData.lepusCode;
				if (lepusCode.root?.source.source().toString()?.includes('createApp')) {
					// In a real implementation, we would inject the Vue runtime here
					const vueRuntimePath = require.resolve('vue/dist/vue.runtime.esm-browser.js');
					lepusCode.chunks.push({
						name: 'vue-runtime',
						source: new RawSource(fs.readFileSync(vueRuntimePath, 'utf8')),
						info: {
							['lynx:main-thread']: true,
						},
					});
				}
				return args;
			});

			// Inject module.exports for async main-thread chunks
			hooks.beforeEncode.tap(this.constructor.name, (args) => {
				const { encodeData } = args;

				// A lazy bundle may not have main-thread code
				if (!encodeData.lepusCode.root) {
					return args;
				}

				if (encodeData.sourceContent.appType === 'card') {
					return args;
				}

				// We inject `module.exports` for each async template
				compilation.updateAsset(
					encodeData.lepusCode.root.name,
					(old) =>
						new ConcatSource(
							`\
(function (globDynamicComponentEntry) {
  const module = { exports: {} }
  const exports = module.exports
`,
							old,
							`\
  return module.exports
})`
						)
				);
				return args;
			});

			// Handle chunk naming
			hooks.asyncChunkName.tap(this.constructor.name, (chunkName) =>
				chunkName?.replaceAll(`-${LAYERS.BACKGROUND}`, '')?.replaceAll(`-${LAYERS.MAIN_THREAD}`, '')
			);
		});
	}

	/**
	 * Update main thread info for a chunk
	 * @private
	 */
	_updateMainThreadInfo(compilation, name) {
		const asset = compilation.getAsset(name);

		// Skip if the asset doesn't exist (could be a dynamic chunk that wasn't generated yet)
		if (!asset) {
			console.warn(`Asset ${name} not found, skipping main thread info update`);
			return;
		}

		compilation.updateAsset(asset.name, asset.source, {
			...asset.info,
			'lynx:main-thread': true,
		});
	}
}

export { LAYERS, VueWebpackPlugin, VueWebpackPluginOptions };
