/**
 * @vitest-environment jsdom
 */
import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LynxCounter from './LynxCounter.vue';

// Register Lynx elements as custom elements directly
// This can help avoid timing issues with dynamically registering elements
const elementsToRegister = ['view', 'text'];

// Register elements once before tests run
for (const element of elementsToRegister) {
  if (!customElements.get(element)) {
    class LynxElement extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        shadow.appendChild(slot);
      }
    }
    customElements.define(element, LynxElement);
  }
}

// Custom rendering functions
function renderCounter() {
  return shallowMount(LynxCounter, {
    global: {
      stubs: {
        // Define explicit stubs with templates that include slots
        view: {
          template: '<div class="lynx-view"><slot /></div>'
        },
        text: {
          template: '<span class="lynx-text"><slot /></span>'
        }
      }
    }
  });
}

// Simple tests that focus on component content
describe('LynxCounter', () => {
  // Reset console mocks and component state before each test
  beforeEach(() => {
    // Silence console output
    vi.spyOn(console, 'log').mockImplementation(() => { });
  });

  it('renders the component without errors', () => {
    expect(() => renderCounter()).not.toThrow();
  });

  it('contains the title text', () => {
    const wrapper = renderCounter();
    expect(wrapper.html()).toContain('Lynx Counter Demo');
  });

  it('displays the initial count as 0', () => {
    const wrapper = renderCounter();
    expect(wrapper.html()).toContain('Count: 0');
  });
}); 
