import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import './index.css';
import registerGlobalComponents from './plugins/global-components';
import router from './router';

// Import Lynx - this is required to define the custom elements
import '@lynx-js/web-core';
import '@lynx-js/web-core/index.css';
import '@lynx-js/web-elements/all';
import '@lynx-js/web-elements/index.css';

const app = createApp(App);

app.use(router);
registerGlobalComponents(app);

app.mount('#app');
