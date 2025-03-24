import LynxCounter from './components/LynxCounter.vue';
import { createLynxApp } from './lynx-vue-renderer';

// This function would be called by Lynx to initialize the app
export function initLynxApp() {
  // Create a Vue app using our custom Lynx renderer
  const app = createLynxApp(LynxCounter);

  // Mount the app to the provided root element
  app.mount('#lynx-root');

  return app;
} 
