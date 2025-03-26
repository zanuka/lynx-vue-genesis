/**
 * Vue Lynx Entry Point
 */

import { createApp } from 'vue';
import LynxTest from './components/LynxTest.vue';

// Create a basic Vue app with the LynxTest component
const app = createApp(LynxTest);

// Mount the app to the DOM
document.addEventListener('DOMContentLoaded', () => {
	// Create a root element if it doesn't exist
	let rootElement = document.getElementById('app');
	if (!rootElement) {
		rootElement = document.createElement('div');
		rootElement.id = 'app';
		document.body.appendChild(rootElement);
	}

	// Mount the app
	app.mount('#app');
	console.log('Vue app mounted');
});
