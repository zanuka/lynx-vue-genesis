console.log('Lynx basic entry point starting');

document.addEventListener('DOMContentLoaded', () => {
	console.log('Lynx basic script initialized');

	const rootElement = document.getElementById('lynx-root');
	if (!rootElement) {
		console.error('Lynx root element not found');
		return;
	}

	console.log('Found lynx-root element');

	const container = document.createElement('view');
	container.className = 'container';
	container.style.padding = '20px';
	container.style.backgroundColor = '#f0f0f0';

	const title = document.createElement('text');
	title.className = 'title';
	title.style.fontSize = '24px';
	title.style.color = '#333';
	title.textContent = 'Basic Lynx Demo';

	const description = document.createElement('text');
	description.className = 'description';
	description.style.fontSize = '16px';
	description.style.color = '#666';
	description.style.marginTop = '10px';
	description.textContent = 'This is a basic Lynx demo without Vue components.';

	container.appendChild(title);
	container.appendChild(description);
	rootElement.appendChild(container);

	console.log('Basic Lynx UI created successfully');
}); 
