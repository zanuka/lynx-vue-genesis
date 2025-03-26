import type { RsbuildPluginAPI } from '@rsbuild/core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginVueLynxOptions } from './index.js';
import { LAYERS } from './layers.js';

interface ExtendedEntryPoint {
	layer?: (name: string) => void;
	options?: Record<string, any>;
	add: (config: { import: string } | string) => void;
	clear: () => void;
}

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
	return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function applyEntry(api: RsbuildPluginAPI, options: Required<PluginVueLynxOptions>): void {
	const { firstScreenSyncTiming } = options;
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	api.modifyBundlerChain((chain, { CHAIN_ID }) => {
		const entryPoints = chain.entryPoints.entries() || {};
		const entryNames = Object.keys(entryPoints);

		entryNames.forEach((entryName) => {
			const entryPath = entryPoints[entryName];
			chain.entry(entryName).clear();

			if (isPlainObject(entryPath) || typeof entryPath === 'string') {
				const options = {
					firstScreenSyncTiming,
				};

				const entry = chain.entry(entryName) as ExtendedEntryPoint;
				entry.add({
					import: typeof entryPath === 'string' ? entryPath : (entryPath as Record<string, string>).import,
				});

				try {
					if (typeof entry.layer === 'function') {
						entry.layer(LAYERS.MAIN_THREAD);
					} else {
						entry.options = {
							...entry.options,
							layer: LAYERS.MAIN_THREAD
						};
					}
				} catch (e) {
					console.warn('Unable to set layer on entry point:', e);
				}

				const runtimePath = path.resolve(__dirname, './loaders/entry-runtime-loader.js');

				chain.module
					.rule(`entry-${entryName}`)
					.test(new RegExp(`${chain.output.get('filename')}`))
					.use('entry-runtime-loader')
					.loader(runtimePath)
					.options({
						entryName,
						entryOptions: options,
					});
			} else if (isPlainObject(entryPath)) {
				Object.entries(entryPath as Record<string, string>).forEach(([key, value]) => {
					const newEntryName = `${entryName}-${key}`;
					const newEntry = chain.entry(newEntryName) as ExtendedEntryPoint;
					newEntry.add(value);
					try {
						if (typeof newEntry.layer === 'function') {
							newEntry.layer(key === 'background' ? LAYERS.BACKGROUND : LAYERS.MAIN_THREAD);
						} else {
							newEntry.options = {
								...newEntry.options,
								layer: key === 'background' ? LAYERS.BACKGROUND : LAYERS.MAIN_THREAD
							};
						}
					} catch (e) {
						console.warn('Unable to set layer on entry point:', e);
					}
				});
			}

			const pluginName = `${CHAIN_ID.PLUGIN.HTML}-${entryName}`;
			if (chain.plugins.has(pluginName)) {
				chain.plugin(pluginName).tap((args) => {
					args[0].chunks = args[0].chunks || [entryName];
					if (isPlainObject(entryPath)) {
						Object.keys(entryPath as Record<string, string>).forEach((key) => {
							const chunkName = `${entryName}-${key}`;
							if (!args[0].chunks.includes(chunkName)) {
								args[0].chunks.push(chunkName);
							}
						});
					}
					return args;
				});
			}
		});
	});
} 
