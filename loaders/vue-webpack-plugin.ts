import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { LynxTemplatePlugin } from '@lynx-js/template-webpack-plugin';
import { RuntimeGlobals } from '@lynx-js/webpack-runtime-globals';

const LAYERS = {
	BACKGROUND: 'vue-background',
	MAIN_THREAD: 'vue-main-thread',
};

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VueWebpackPluginOptions {
	enableLazyLoading = false;
	enableSSR = false;
	mainThreadChunks = [];
	firstScreenSyncTiming = 'immediately';
	enableDevTools = false;
}

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
${RuntimeGlobals.lynxProcessEvalResult} = function (result, schema) {
  var chunk = result(schema);
  if (chunk.ids && chunk.modules) {
    ${webpack.RuntimeGlobals.externalInstallChunk ? webpack.RuntimeGlobals.externalInstallChunk : '__webpack_require__.C'}(chunk);
    for (var moduleId in chunk.modules) {
      ${webpack.RuntimeGlobals.require ? webpack.RuntimeGlobals.require : '__webpack_require__'}(moduleId);
    }
    return chunk;
  }
  
  if (typeof result === 'object' && result.__esModule && result.default && 
      (typeof result.default === 'object' || typeof result.default === 'function')) {
    return result.default;
  }
  return result;
};`;
		}
	};
}

class VueWebpackPlugin {
	static loaders = {
		BACKGROUND: path.resolve(process.cwd(), 'dist/loaders/vue-lynx-background.ts'),
		MAIN_THREAD: path.resolve(process.cwd(), 'dist/loaders/vue-lynx-main-thread.ts'),
	};

	private options: VueWebpackPluginOptions;

	constructor(options = {}) {
		this.options = { ...new VueWebpackPluginOptions(), ...options };
	}

	apply(compiler) {
		const options = this.options;
		const { BannerPlugin, DefinePlugin, EnvironmentPlugin } = compiler.webpack;

		if (!options.enableLazyLoading) {
			new BannerPlugin({
				banner: `'use strict';var globDynamicComponentEntry=globDynamicComponentEntry||'__Vue__';`,
				raw: true,
				test: options.mainThreadChunks,
			}).apply(compiler);
		}

		new EnvironmentPlugin({
			NODE_ENV: null,
			DEBUG: null,
		}).apply(compiler);

		new DefinePlugin({
			__VUE_DEV_MODE__: JSON.stringify(compiler.options.mode === 'development'),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(options.enableDevTools),
			__ENABLE_SSR__: JSON.stringify(options.enableSSR),
			__FIRST_SCREEN_SYNC_TIMING__: JSON.stringify(options.firstScreenSyncTiming),
		}).apply(compiler);

		compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
			const onceForChunkSet = new WeakSet();

			compilation.hooks.runtimeRequirementInTree
				.for(compiler.webpack.RuntimeGlobals.ensureChunkHandlers)
				.tap('VueWebpackPlugin', (_, runtimeRequirements) => {
					runtimeRequirements.add(RuntimeGlobals.lynxProcessEvalResult);
				});

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

			compilation.hooks.processAssets.tap(
				{
					name: this.constructor.name,
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
				},
				() => {
					for (const name of options.mainThreadChunks) {
						this._updateMainThreadInfo(compilation, name);
					}

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

			const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation);
			const { RawSource, ConcatSource } = compiler.webpack.sources;

			hooks.beforeEncode.tap(this.constructor.name, (args) => {
				const lepusCode = args.encodeData.lepusCode;
				if (lepusCode.root?.source.source().toString()?.includes('createApp')) {
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

			hooks.beforeEncode.tap(this.constructor.name, (args) => {
				const { encodeData } = args;

				if (!encodeData.lepusCode.root) {
					return args;
				}

				if (encodeData.sourceContent.appType === 'card') {
					return args;
				}

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

			hooks.asyncChunkName.tap(this.constructor.name, (chunkName) =>
				chunkName?.replaceAll(`-${LAYERS.BACKGROUND}`, '')?.replaceAll(`-${LAYERS.MAIN_THREAD}`, '')
			);
		});
	}

	_updateMainThreadInfo(compilation, name) {
		const asset = compilation.getAsset(name);

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
