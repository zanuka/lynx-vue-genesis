// Main thread entry point for Lynx
// This file runs in the main thread and handles the UI/DOM manipulation

// Import Vue and createApp
import { createApp, h } from 'vue';

// Import our components
import LynxCounter from './components/common/LynxCounter.vue';
import LynxDebugPanel from './components/common/LynxDebugPanel.vue';
import LynxFooter from './components/common/LynxFooter.vue';
import LynxHelloWorld from './components/common/LynxHelloWorld.vue';
// Add debugging
console.log('Lynx main thread script starting');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Lynx main thread initialized');

  // Create a root element for our Lynx app
  const rootElement = document.getElementById('lynx-root');
  if (!rootElement) {
    console.error('Lynx root element not found');
    return;
  }

  console.log('Found lynx-root element');

  // Worker variable for potential later use
  let worker: Worker | null = null;

  // Initialize worker thread if possible
  try {
    if (window.Worker) {
      console.log('Web Workers are supported');
      worker = new Worker(new URL('./lynx-worker.ts', import.meta.url), { type: 'module' });
      console.log('Worker initialized successfully');

      // Setup communication channel between threads
      worker.onmessage = (event) => {
        // Handle messages from worker thread
        const { type, data } = event.data;
        console.log('Received message from worker:', type, data);

        switch (type) {
          case 'STATE_UPDATE':
            // Update UI based on state changes
            console.log('State update from worker:', data);
            break;

          case 'RENDER':
            // Render or update the UI
            console.log('Render request from worker');
            break;

          default:
            console.warn('Unknown message type from worker:', type);
        }
      };
    } else {
      console.warn('Web Workers are not supported in this browser');
    }
  } catch (error) {
    console.error('Error initializing worker:', error);
    console.log('Continuing without worker support');
  }

  // Create Vue app
  try {
    console.log('Creating Vue app with Lynx components');
    const app = createApp({
      render() {
        return h('div', { class: 'lynx-app-container' }, [
          h(LynxHelloWorld, {
            msg: 'Vue Lynx Hello World',
            onVnodeBeforeMount() {
              console.log('LynxHelloWorld before mount');
            },
            onVnodeMounted() {
              console.log('LynxHelloWorld mounted');
            },
          }),
          h(LynxCounter),
          h(LynxDebugPanel),
          h(LynxFooter),
        ]);
      },
    });

    // Mount the app to the DOM
    console.log('Mounting Vue app to lynx-root');
    app.mount(rootElement);
    console.log('Vue app mounted successfully');

    // For debugging: Send a message to the worker after a delay
    if (worker) {
      setTimeout(() => {
        console.log('Sending test message to worker');
        try {
          worker?.postMessage({
            type: 'METHOD_CALL',
            method: 'setMessage',
            params: ['Message from main thread'],
          });
        } catch (e) {
          console.error('Failed to send message to worker:', e);
        }
      }, 2000);
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
