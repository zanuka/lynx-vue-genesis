/**
 * Rsbuild plugin for Vue - Lynx integration
 * Adds support for Vue in the Lynx ecosystem
 */

import { RsbuildPlugin } from '@rsbuild/core';
import path from 'path';

interface VueLynxPluginOptions {
  platform?: 'ios' | 'android' | 'web';
  mainThreadEntries?: string[];
  backgroundThreadEntries?: string[];
}

/**
 * Plugin for Rsbuild that provides Vue integration with Lynx
 */
export default function pluginVueLynx(options: VueLynxPluginOptions = {}): RsbuildPlugin {
  return {
    name: 'vue-lynx-plugin',
    setup(api) {
      // Add necessary aliases and configurati
      api.modifyRsbuildConfig((config) => {
        config.source = config.source || {};
        config.source.alias = config.source.alias || {};

        // Add any necessary Vue-Lynx runtime alia
        config.source.alias['@vue-lynx/runtime'] = path.resolve(__dirname, '../runtime');
        return config;
      });
    },
  }
}
