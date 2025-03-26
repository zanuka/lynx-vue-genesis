import LynxCounter from './components/common/LynxCounter.vue';
import { createLynxApp } from './lynx-vue-renderer';

export function initLynxApp() {
  const app = createLynxApp(LynxCounter);

  app.mount('#lynx-root');

  return app;
} 
