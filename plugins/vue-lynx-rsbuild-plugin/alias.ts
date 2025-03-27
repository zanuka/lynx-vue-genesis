import type { RsbuildPluginAPI } from '@rsbuild/core';
import path from 'node:path';
import { LAYERS } from './layers.js';

export async function applyAlias(api: RsbuildPluginAPI): Promise<void> {
	api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
		return mergeRsbuildConfig(config, {
			source: {
				alias: {
					'@vue-lynx/runtime': path.resolve(api.context.rootPath, 'runtime'),
					'@vue-lynx/components': path.resolve(api.context.rootPath, 'src/components/common'),
				},
			},
		});
	});

	api.modifyBundlerChain((chain) => {
		chain.module
			.rule('vue-lynx:main-thread-alias')
			.issuerLayer(LAYERS.MAIN_THREAD)
			.resolve.alias
			.set('background-only', path.resolve(api.context.rootPath, 'plugins/vue-lynx-rsbuild-plugin/background-only/error.js'));

		chain.module
			.rule('vue-lynx:background-alias')
			.issuerLayer(LAYERS.BACKGROUND)
			.resolve.alias
			.set('background-only', path.resolve(api.context.rootPath, 'plugins/vue-lynx-rsbuild-plugin/background-only/empty.js'));
	});
} 
