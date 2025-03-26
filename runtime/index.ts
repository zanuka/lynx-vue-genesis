/**
 * Vue Lynx Runtime Adapter
 *
 * This module adapts Vue's DOM operations to Lynx's Element PAPI.
 * It replaces standard DOM methods with Lynx-compatible equivalents.
 */

// Import shared types
import { LynxElement } from './lynx-types.js';

// Export something to make this file a module
export { };

// Store original methods for reference or fallback with proper binding
const originalCreateElement =
	typeof document !== 'undefined' ? document.createElement.bind(document) : null;

const originalAppendChild =
	typeof Node !== 'undefined' && Node.prototype
		? Node.prototype.appendChild.bind(Node.prototype)
		: null;

const originalSetAttribute =
	typeof Element !== 'undefined' && Element.prototype
		? Element.prototype.setAttribute.bind(Element.prototype)
		: null;

// Flag to track if the runtime is already patched
let isPatchApplied = false;

/**
 * Custom implementation of createElement that works with Lynx
 */
function createElement(tagName: string, options?: ElementCreationOptions): LynxElement {
	// Use Lynx's createElement if available in the global scope
	if (typeof window !== 'undefined' && window.lynx?.createElement) {
		return window.lynx.createElement(tagName, options);
	}
	// Fallback to normal DOM
	if (originalCreateElement) {
		return originalCreateElement(tagName, options) as LynxElement;
	}
	throw new Error('createElement not available');
}

/**
 * Custom implementation of appendChild that works with Lynx
 */
function appendChild(parent: Node, child: Node): Node {
	// Use Lynx's appendChild if available in the global scope
	if (typeof window !== 'undefined' && window.lynx?.appendChild) {
		return window.lynx.appendChild(parent, child);
	}
	// Fallback to normal DOM
	if (originalAppendChild) {
		return originalAppendChild.call(parent, child);
	}
	throw new Error('appendChild not available');
}

/**
 * Custom implementation of setAttribute that works with Lynx
 */
function setAttribute(element: Element, name: string, value: string): void {
	// Use Lynx's setAttribute if available in the global scope
	if (typeof window !== 'undefined' && window.lynx?.setAttribute) {
		window.lynx.setAttribute(element, name, value);
		return;
	}
	// Fallback to normal DOM
	if (originalSetAttribute) {
		originalSetAttribute.call(element, name, value);
		return;
	}
	throw new Error('setAttribute not available');
}

/**
 * Initialize the Vue Lynx adapter by patching methods
 */
export function initVueLynxAdapter() {
	if (isPatchApplied) {
		return;
	}

	patchVueRuntime();
	isPatchApplied = true;
	return { patched: true };
}

/**
 * Patch Vue's runtime to use Lynx's Element PAPI
 */
export function patchVueRuntime() {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		console.warn('Document or window is undefined. Running in a non-browser environment?');
		return;
	}

	// Patch document.createElement
	document.createElement = function (tagName: string, options?: ElementCreationOptions) {
		if (typeof window !== 'undefined' && window.lynx?.createElement) {
			return window.lynx.createElement(tagName, options);
		}
		if (originalCreateElement) {
			return originalCreateElement(tagName, options);
		}
		// If all else fails, use the native document function
		return HTMLElement.prototype.constructor.call(document);
	} as any;

	// Patch Node.prototype.appendChild
	if (Node && Node.prototype) {
		Node.prototype.appendChild = function <T extends Node>(child: T): T {
			if (typeof window !== 'undefined' && window.lynx?.appendChild) {
				return window.lynx.appendChild(this, child) as T;
			}
			if (originalAppendChild) {
				return originalAppendChild.call(this, child) as T;
			}
			throw new Error('appendChild not available');
		};
	}

	// Patch Element.prototype.setAttribute
	if (Element && Element.prototype) {
		Element.prototype.setAttribute = function (name: string, value: string): void {
			if (typeof window !== 'undefined' && window.lynx?.setAttribute) {
				window.lynx.setAttribute(this, name, value);
				return;
			}
			if (originalSetAttribute) {
				originalSetAttribute(name, value);
				return;
			}
			throw new Error('setAttribute not available');
		};
	}
}
