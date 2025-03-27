/**
 * Global TypeScript declarations for Vue Lynx
 */

export { }; // Make this a module

// Define the runtime interface
interface VueLynxRuntime {
	initialized: boolean;
	options: {
		firstScreenSyncTiming: 'immediately' | 'jsReady';
		entryName: string;
	};
}

// Augment the Window interface globally
declare global {
	interface Window {
		__VUE_LYNX_RUNTIME__: VueLynxRuntime;
	}
} 
