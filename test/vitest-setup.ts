import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/vue';
import ResizeObserver from 'resize-observer-polyfill';
import { afterAll, beforeAll, vi } from 'vitest';

global.ResizeObserver = ResizeObserver;

global.MutationObserver = class {
	observe() { }
	disconnect() { }
	takeRecords() { return []; }
};

if (typeof globalThis.document !== 'undefined') {
	Object.defineProperty(globalThis.document, 'doctype', {
		value: '<!DOCTYPE html>'
	});

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

afterAll(() => {
	vi.restoreAllMocks();
});

configure({
	testIdAttribute: 'data-test-id'
});
