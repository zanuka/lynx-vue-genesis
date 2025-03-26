import { createApp } from 'vue';
import { initVueLynxAdapter } from '../runtime/index.js';
import App from './App.vue';
import './assets/main.css';
import './index.css';
import registerGlobalComponents from './plugins/global-components';
import router from './router';

import '@lynx-js/web-core';
import '@lynx-js/web-core/index.css';
import '@lynx-js/web-elements/all';
import '@lynx-js/web-elements/index.css';

type LynxRuntime = {
  platform: 'ios' | 'android' | 'web';
  [key: string]: any;
};

const app = createApp(App);

app.use(router);
registerGlobalComponents(app);

const vueLynx = initVueLynxAdapter();

if (typeof window.lynx !== 'undefined') {
  app.mount('#lynxapp');
} else {
  app.mount('#app');
}
