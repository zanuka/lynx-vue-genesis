import type { RsbuildPluginAPI } from '@rsbuild/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYERS } from './layers.js';

export function applyBackgroundOnly(api: RsbuildPluginAPI): void {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	api.modifyBundlerChain((chain) => {
		chain.module
			.rule('background-only')
			.test(/background-only$/)
			.set('issuerLayer', LAYERS.MAIN_THREAD)
			.use('background-only-error')
			.loader(path.resolve(__dirname, './background-only/error.js'))
			.end();

		chain.module
			.rule('background-only-background')
			.test(/background-only$/)
			.set('issuerLayer', LAYERS.BACKGROUND)
			.use('background-only-empty')
			.loader(path.resolve(__dirname, './background-only/empty.js'))
			.end();
	});
} 
