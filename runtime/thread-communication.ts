/**
 * Vue Lynx Thread Communication
 *
 * This module provides utilities for communication between the UI thread
 * and the background thread in a Vue application running with Lynx.
 */

// Import shared types
import { MessageHandler } from './lynx-types.js';

// Export something to make this file a module
export { };

// We'll implement these functions ourselves
const postMessage = (message: any): void => {
	if (typeof window !== 'undefined' && window.lynx?.postMessage) {
		window.lynx.postMessage(message);
	} else if (typeof window !== 'undefined') {
		window.postMessage(message, '*');
	}
};

const onMessage = (handler: MessageHandler): (() => void) => {
	if (typeof window !== 'undefined' && window.lynx?.onMessage) {
		return window.lynx.onMessage(handler);
	} else if (typeof window !== 'undefined') {
		const listener = (e: MessageEvent) => handler(e.data);
		window.addEventListener('message', listener);
		return () => window.removeEventListener('message', listener);
	}
	return () => {
		// Empty function
	};
};

// Define thread layers
export const LAYERS = {
	BACKGROUND: 'vue-background',
	MAIN_THREAD: 'vue-main-thread',
} as const;

/**
 * Send a message to the background thread
 *
 * @param {string} type - The type of message
 * @param {any} payload - The message payload
 * @returns {Promise<any>} - Promise resolving to the response
 */
export function useBackgroundThread(type, payload = {}) {
	if (typeof postMessage !== 'function') {
		console.warn('postMessage not available for background thread communication');
		return Promise.resolve(null);
	}

	// Generate a unique ID for this message
	const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

	// Include the layer information in the message
	const message = {
		id: messageId,
		type,
		payload,
		layer: LAYERS.BACKGROUND,
	};

	return new Promise((resolve) => {
		// Set up a one-time listener for the response
		const cleanup = onMessage((response) => {
			if (response && response.id === messageId) {
				cleanup(); // Remove the listener
				resolve(response.data);
			}
		});

		// Send the message to the background thread
		postMessage(message);
	});
}

/**
 * Send a message to the main UI thread
 *
 * @param {string} type - The type of message
 * @param {any} payload - The message payload
 * @returns {Promise<any>} - Promise resolving to the response
 */
export function useMainThread(type, payload = {}) {
	if (typeof postMessage !== 'function') {
		console.warn('postMessage not available for main thread communication');
		return Promise.resolve(null);
	}

	// Generate a unique ID for this message
	const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

	// Include the layer information in the message
	const message = {
		id: messageId,
		type,
		payload,
		layer: LAYERS.MAIN_THREAD,
	};

	return new Promise((resolve) => {
		// Set up a one-time listener for the response
		const cleanup = onMessage((response) => {
			if (response && response.id === messageId) {
				cleanup(); // Remove the listener
				resolve(response.data);
			}
		});

		// Send the message to the main thread
		postMessage(message);
	});
}
