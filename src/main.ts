import { createApp } from 'vue';
import { initVueLynxAdapter } from '../runtime/index.js';
import App from './App.vue';
import './assets/main.css';
import './index.css';
import registerGlobalComponents from './plugins/global-components';
import router from './router';

// Import Lynx web components
import '@lynx-js/web-core';
import '@lynx-js/web-core/index.css';
import '@lynx-js/web-elements/all';
import '@lynx-js/web-elements/index.css';

// Add type definition for the global lynx object
declare global {
  interface Window {
    lynx?: {
      platform: 'ios' | 'android' | 'web';
      [key: string]: any;
    };
  }
}

const app = createApp(App);

app.use(router);
registerGlobalComponents(app);

// Initialize the Vue-Lynx adapter
const vueLynx = initVueLynxAdapter();

// Different mounting strategy based on environment
if (typeof window.lynx !== 'undefined') {
  // Lynx mobile environment
  app.mount('#lynxapp');
} else {
// Browser fallback environment
  app.mount('#app');
}
