import { RsbuildPlugin } from '@rsbuild/core';
import path from 'path';

interface VueLynxPluginOptions {
  platform?: 'ios' | 'android' | 'web';
  mainThreadEntries?: string[];
  backgroundThreadEntries?: string[];
}

export default function pluginVueLynx(options: VueLynxPluginOptions = {}): RsbuildPlugin {
  return {
    name: 'vue-lynx-plugin',
    setup(api) {
      api.modifyRsbuildConfig((config) => {
        config.source = config.source || {};
        config.source.alias = config.source.alias || {};
        config.source.alias['@vue-lynx/runtime'] = path.resolve(__dirname, '../runtime');
        return config;
      });
    },
  }
}
