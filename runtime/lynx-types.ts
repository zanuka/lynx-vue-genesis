/**
 * Type definitions for Lynx integration
 *
 * This file defines common types used across the Vue-Lynx integration
 */

// Export something to make this file a module
export { };

// Define types for message handling
export type MessageHandler = (message: any) => void;

// Define Lynx element type
export interface LynxElement extends HTMLElement {
	// Add Lynx-specific properties here as they become known
	__lynx?: {
		id?: string;
		tag?: string;
		attributes?: Record<string, string>;
	};
}

// Extend Window interface to include lynx property
declare global {
	interface Window {
		lynx?: {
			// Platform information
			platform: 'ios' | 'android' | 'web';

			// Element operations
			createElement?: (tagName: string, options?: ElementCreationOptions) => LynxElement;
			appendChild?: (parent: Node, child: Node) => Node;
			setAttribute?: (element: Element, name: string, value: string) => void;

			// Thread communication
			postMessage?: (message: any) => void;
			onMessage?: (handler: MessageHandler) => () => void;

			// Allow for other properties
			[key: string]: any;
		};
	}
}
