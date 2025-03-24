// Worker thread entry point for Lynx
// This file runs in a web worker and handles business logic

// Add debug logging
console.log('Lynx worker thread script starting');

try {
  // Set up self as a proper worker context
  const worker = self as unknown as Worker;

  // Define the state type
  interface WorkerState {
    count: number;
    lastUpdated: string;
    message?: string;
  }

  // State management (simple example)
  let state: WorkerState = {
    count: 0,
    lastUpdated: new Date().toISOString()
  };

  // Log initial state
  console.log('Worker initial state:', state);

  // Methods for state updates
  const methods = {
    increment() {
      console.log('Worker: increment method called');
      state.count++;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: new count =', state.count);
      notifyStateUpdate();
    },

    decrement() {
      console.log('Worker: decrement method called');
      state.count--;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: new count =', state.count);
      notifyStateUpdate();
    },

    reset() {
      console.log('Worker: reset method called');
      state.count = 0;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: count reset to', state.count);
      notifyStateUpdate();
    },

    setMessage(message: string) {
      console.log('Worker: setMessage called with:', message);
      state = { ...state, message };
      notifyStateUpdate();
    }
  };

  // Notify the main thread about state updates
  function notifyStateUpdate() {
    try {
      console.log('Worker: notifying main thread of state update', state);
      worker.postMessage({
        type: 'STATE_UPDATE',
        data: { ...state }
      });
    } catch (error) {
      console.error('Worker: failed to notify main thread:', error);
    }
  }

  // Request a UI render/update
  function requestRender() {
    try {
      console.log('Worker: requesting render from main thread');
      worker.postMessage({
        type: 'RENDER',
        data: null
      });
    } catch (error) {
      console.error('Worker: failed to request render:', error);
    }
  }

  // Handle messages from the main thread
  worker.addEventListener('message', (event) => {
    try {
      const { type, method, params } = event.data;
      console.log('Worker received message:', event.data);

      switch (type) {
        case 'METHOD_CALL':
          // Execute a method if it exists
          if (method in methods) {
            console.log(`Worker: executing method "${method}" with params:`, params);
            (methods as any)[method](...(params || []));
          } else {
            console.warn(`Worker: unknown method: ${method}`);
          }
          break;

        case 'INIT':
          // Initialize the worker with initial state
          console.log('Worker: initialized with data:', event.data);
          notifyStateUpdate();
          break;

        default:
          console.warn('Worker: unknown message type:', type);
      }
    } catch (error) {
      console.error('Worker: error handling message:', error);
    }
  });

  // Handle errors
  self.addEventListener('error', (error) => {
    console.error('Worker: global error:', error);
  });

  // Handle unhandled rejections
  self.addEventListener('unhandledrejection', (event) => {
    console.error('Worker: unhandled promise rejection:', event);
  });

  // Notify that the worker is ready
  console.log('Lynx worker thread initialized and ready');

  // Initial state notification
  notifyStateUpdate();

  // Periodic state update for demo purposes
  const intervalId = setInterval(() => {
    try {
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: periodic update, current state:', state);
      notifyStateUpdate();
    } catch (error) {
      console.error('Worker: error in periodic update:', error);
      clearInterval(intervalId);
    }
  }, 5000);

} catch (error) {
  console.error('Worker: fatal error during initialization:', error);
  // Try to notify the main thread if possible
  try {
    (self as unknown as Worker).postMessage({
      type: 'ERROR',
      data: { message: 'Worker initialization failed', error: String(error) }
    });
  } catch (e) {
    console.error('Worker: could not notify main thread of fatal error:', e);
  }
} 
