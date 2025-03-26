import { createApp } from 'vue';

const app = createApp(LynxTest);

document.addEventListener('DOMContentLoaded', () => {
	let rootElement = document.getElementById('app');
	if (!rootElement) {
		rootElement = document.createElement('div');
		rootElement.id = 'app';
		document.body.appendChild(rootElement);
	}

	app.mount('#app');
	console.log('Vue app mounted');
});
