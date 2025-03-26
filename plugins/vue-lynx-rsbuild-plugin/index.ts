import type { RsbuildPlugin } from '@rsbuild/core';

import { applyAlias } from './alias.js';
import { applyBackgroundOnly } from './background-only.js';
import { applyCSS } from './css.js';
import { applyEntry } from './entry.js';
import { LAYERS } from './layers.js';
import { applyLoaders } from './loaders.js';
import { validateConfig } from './validate.js';

export interface PluginVueLynxOptions {
	enableCSSSelector?: boolean;
	enableParallelElement?: boolean;
	firstScreenSyncTiming?: 'immediately' | 'jsReady';
	enableDevTools?: boolean;
	engineVersion?: string;
}

export function pluginVueLynx(options: PluginVueLynxOptions = {}): RsbuildPlugin {
	validateConfig(options);

	const engineVersion = options?.engineVersion ?? '3.2';

	const defaultOptions: Required<PluginVueLynxOptions> = {
		enableCSSSelector: true,
		enableParallelElement: false,
		firstScreenSyncTiming: 'jsReady',
		enableDevTools: process.env.NODE_ENV !== 'production',
		engineVersion,
	};

	const resolvedOptions = {
		...defaultOptions,
		...options,
	};

	return {
		name: 'plugin-vue-lynx',

		async setup(api) {
			await applyAlias(api);
			applyBackgroundOnly(api);
			applyCSS(api, resolvedOptions);
			applyEntry(api, resolvedOptions);
			applyLoaders(api, resolvedOptions);
			api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
				const userConfig = api.getRsbuildConfig('original');

				if (!userConfig.source?.include) {
					return mergeRsbuildConfig(config, {
						source: {
							include: ['**/*.vue', '**/*.ts', '**/*.js'],
						},
					});
				}

				return config;
			});
		},
	};
}

export { LAYERS };
