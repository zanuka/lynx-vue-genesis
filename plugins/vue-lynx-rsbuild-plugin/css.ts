import type { CSSLoaderOptions, RsbuildPluginAPI } from '@rsbuild/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginVueLynxOptions } from './index.js';
import { LAYERS } from './layers.js';

interface CSSModuleOptions {
	exportOnlyLocals?: boolean;
	mode?: 'local' | 'global' | 'pure' | 'icss' | ((resourcePath: string) => 'local' | 'global' | 'pure' | 'icss');
	[key: string]: any;
}

export function applyCSS(api: RsbuildPluginAPI, options: Required<PluginVueLynxOptions>): void {
	const { enableCSSSelector, engineVersion } = options;

	api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) =>
		mergeRsbuildConfig(config, {
			output: {
				injectStyles: false,
			},
		})
	);

	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	api.modifyBundlerChain(async function (chain, { CHAIN_ID, environment }) {
		const cssExtractPlugin = await loadCssExtractPlugin();

		const cssRules = [
			CHAIN_ID.RULE.CSS,
			CHAIN_ID.RULE.SASS,
			CHAIN_ID.RULE.LESS,
			CHAIN_ID.RULE.STYLUS,
		];

		cssRules
			.filter((rule) => chain.module.rules.has(rule))
			.forEach((ruleName) => {
				const rule = chain.module.rule(ruleName);

				if (rule.uses.has(CHAIN_ID.USE.LIGHTNINGCSS) && environment.name === 'lynx') {
					rule.uses.delete(CHAIN_ID.USE.LIGHTNINGCSS);
				}

				rule
					.issuerLayer(LAYERS.BACKGROUND)
					.use(CHAIN_ID.USE.MINI_CSS_EXTRACT)
					.loader(cssExtractPlugin.loader)
					.end();

				const uses = rule.uses.entries();
				const ruleEntries = rule.entries();
				const cssLoaderRule = uses[CHAIN_ID.USE.CSS].entries();

				chain.module
					.rule(`${ruleName}:${LAYERS.MAIN_THREAD}`)
					.merge(ruleEntries)
					.issuerLayer(LAYERS.MAIN_THREAD)
					.use(CHAIN_ID.USE.IGNORE_CSS)
					.loader(path.resolve(__dirname, './loaders/ignore-css-loader.js'))
					.end()
					.uses.merge(uses)
					.delete(CHAIN_ID.USE.MINI_CSS_EXTRACT)
					.delete(CHAIN_ID.USE.LIGHTNINGCSS)
					.delete(CHAIN_ID.USE.CSS)
					.end()
					.use(CHAIN_ID.USE.CSS)
					.after(CHAIN_ID.USE.IGNORE_CSS)
					.merge(cssLoaderRule)
					.options(normalizeCssLoaderOptions(cssLoaderRule.options, true))
					.end();
			});

		chain.plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
			.tap(([options]) => [
				{
					...options,
					enableCSSSelector,
					engineVersion,
					cssPlugins: [
						{
							parserPlugins: {
								removeFunctionWhiteSpace: () => ({
									postcssPlugin: 'remove-function-whitespace',
									Declaration(decl) {
										if (decl.value && decl.value.includes('(')) {
											decl.value = decl.value.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
										}
									},
								}),
							},
						},
					],
				},
			])
			.end();
	});
}

export const normalizeCssLoaderOptions = (
	options: CSSLoaderOptions,
	exportOnlyLocals: boolean
): CSSLoaderOptions => {
	if (options.modules && exportOnlyLocals) {
		let modules: CSSModuleOptions;
		if (options.modules === true) {
			modules = { exportOnlyLocals: true };
		} else if (typeof options.modules === 'object' && options.modules !== null) {
			modules = { ...options.modules, exportOnlyLocals: true } as CSSModuleOptions;
		} else if (typeof options.modules === 'string') {
			const mode = options.modules as 'local' | 'global' | 'pure' | 'icss';
			modules = { mode, exportOnlyLocals: true };
		} else {
			modules = { exportOnlyLocals: true };
		}
		return {
			...options,
			modules,
		};
	}

	return options;
};

async function loadCssExtractPlugin() {
	try {
		try {
			const { CssExtractRspackPlugin, CssExtractWebpackPlugin } = await import('@lynx-js/css-extract-webpack-plugin');
			return CssExtractWebpackPlugin;
		} catch (e) {
			const MiniCssExtractPlugin = await import('mini-css-extract-plugin');
			return MiniCssExtractPlugin.default;
		}
	} catch (e) {
		console.error('Failed to load CSS extract plugin:', e);
		throw e;
	}
} 
