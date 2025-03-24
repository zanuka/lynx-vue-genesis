import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/vue';
import ResizeObserver from 'resize-observer-polyfill';
import { afterAll, beforeAll, vi } from 'vitest';

// Setup global DOM environment
global.ResizeObserver = ResizeObserver;

// Mock for MutationObserver
global.MutationObserver = class {
	observe() { }
	disconnect() { }
	takeRecords() { return []; }
};

// Add missing DOM properties
if (typeof globalThis.document !== 'undefined') {
	Object.defineProperty(globalThis.document, 'doctype', {
		value: '<!DOCTYPE html>'
	});

	// Mock createRange with appropriate types
	if (!document.createRange) {
		document.createRange = () => {
			const range = {
				setStart: () => { },
				setEnd: () => { },
				commonAncestorContainer: document.createElement('div'),
				createContextualFragment(html: string) {
					const template = document.createElement('template');
					template.innerHTML = html;
					return template.content;
				}
			};
			return range as unknown as Range;
		};
	}
}

// Enhanced mock for customElements API
if (typeof customElements === 'undefined') {
	const definedElements = new Map();

	global.customElements = {
		define: vi.fn((name, constructor) => {
			definedElements.set(name, constructor);
		}),
		get: vi.fn((name) => definedElements.get(name) || null),
		whenDefined: vi.fn(() => Promise.resolve()),
		upgrade: vi.fn(),
		getName: vi.fn(() => null)
	} as unknown as CustomElementRegistry;
}

// Silence console noise during tests
beforeAll(() => {
	vi.spyOn(console, 'error').mockImplementation((...args) => {
		const msg = args.join(' ');
		if (
			msg.includes('custom element') ||
			msg.includes('CustomElement') ||
			msg.includes('not defined') ||
			msg.includes('unhandled') ||
			msg.includes('Vue warn')
		) {
			return;
		}
		// Let other errors through to console
		console.info('Console error passed through:', ...args);
	});

	vi.spyOn(console, 'warn').mockImplementation((...args) => {
		const msg = args.join(' ');
		if (
			msg.includes('vue') ||
			msg.includes('component') ||
			msg.includes('custom element')
		) {
			return;
		}
		console.info('Console warning passed through:', ...args);
	});
});

// Reset mocks after all tests
afterAll(() => {
	vi.restoreAllMocks();
});

// Configure testing library
configure({
	testIdAttribute: 'data-test-id'
});
