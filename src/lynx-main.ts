// Main thread entry point for Lynx
// This file runs in the main thread and handles the UI/DOM manipulation

// Import Vue and createApp
import { createApp } from 'vue';
import App from './App.vue';

// Add debugging
console.log('Lynx main thread script starting');

// Initialize Vue Lynx runtime
if (window.__VUE_LYNX_RUNTIME__) {
  window.__VUE_LYNX_RUNTIME__.init({
    debug: true
  });
}

// Initialize Lynx App
function initializeApp() {
  // Ensure root element exists
  let rootElement = document.getElementById('lynx-root');
  if (!rootElement) {
    console.log('Creating lynx-root element');
    rootElement = document.createElement('div');
    rootElement.id = 'lynx-root';
    document.body.appendChild(rootElement);
  }

  console.log('Found/created lynx-root element');
  return rootElement;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Lynx main thread initialized');

  // Get or create the root element
  const rootElement = initializeApp();

  // Create Vue app
  try {
    console.log('Creating Vue app with Lynx components');
    const app = createApp(App);

    // Mount the app to the DOM
    console.log('Mounting Vue app to lynx-root');
    app.mount(rootElement);
    console.log('Vue app mounted successfully');

    // Report first screen timing if available
    if (window.__VUE_LYNX_RUNTIME__) {
      window.__VUE_LYNX_RUNTIME__.reportFirstScreenTiming();
    }
  } catch (error: unknown) {
    console.error('Error creating or mounting Vue app:', error);

    // Fallback to show at least something
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Error Loading Vue-Lynx Demo</h1>
        <p>Check the console for details</p>
        <pre style="background: #f5f5f5; padding: 10px; text-align: left; overflow: auto;">${error instanceof Error ? error.toString() : 'Unknown error'}</pre>
      </div>
    `;
  }
});
