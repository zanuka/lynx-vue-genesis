console.log('Lynx worker thread script starting');

try {
  const worker = self as unknown as Worker;

  interface WorkerState {
    count: number;
    lastUpdated: string;
    message?: string;
  }

  let state: WorkerState = {
    count: 0,
    lastUpdated: new Date().toISOString()
  };

  console.log('Worker initial state:', state);
  const methods = {
    increment() {
      state.count++;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: new count =', state.count);
      notifyStateUpdate();
    },

    decrement() {
      state.count--;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: new count =', state.count);
      notifyStateUpdate();
    },

    reset() {
      state.count = 0;
      state.lastUpdated = new Date().toISOString();
      console.log('Worker: count reset to', state.count);
      notifyStateUpdate();
    },

    setMessage(message: string) {
      state = { ...state, message };
      notifyStateUpdate();
    }
  };

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

  worker.addEventListener('message', (event) => {
    try {
      const { type, method, params } = event.data;
      console.log('Worker received message:', event.data);

      switch (type) {
        case 'METHOD_CALL':
          if (method in methods) {
            console.log(`Worker: executing method "${method}" with params:`, params);
            (methods as any)[method](...(params || []));
          } else {
            console.warn(`Worker: unknown method: ${method}`);
          }
          break;

        case 'INIT':
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

  self.addEventListener('error', (error) => {
    console.error('Worker: global error:', error);
  });

  self.addEventListener('unhandledrejection', (event) => {
    console.error('Worker: unhandled promise rejection:', event);
  });

  console.log('Lynx worker thread initialized and ready');

  notifyStateUpdate();

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
  try {
    (self as unknown as Worker).postMessage({
      type: 'ERROR',
      data: { message: 'Worker initialization failed', error: String(error) }
    });
  } catch (e) {
    console.error('Worker: could not notify main thread of fatal error:', e);
  }
} 
