// Custom Vue renderer for Lynx
// Based on the approach outlined in https://github.com/lynx-family/lynx/issues/144#issuecomment-2705466656

import type { RendererOptions } from 'vue';
import { createRenderer } from 'vue';

// The Lynx Element PAPI functions would be imported here
// These are placeholder implementations
declare global {
  interface Window {
    __CreateElement: (tagName: string) => any;
    __SetAttribute: (el: any, key: string, value: any) => void;
    __AppendChild: (parent: any, child: any) => void;
    __InsertBefore: (parent: any, child: any, anchor: any) => void;
    __RemoveChild: (parent: any, child: any) => void;
    __SetElementText: (el: any, text: string) => void;
    __SetText: (el: any, text: string) => void;
  }
}

// Create custom renderer options that use Lynx's Element PAPI
const rendererOptions: RendererOptions<any, any> = {
  // Create element
  createElement(type) {
    return window.__CreateElement(type);
  },

  // Set element properties
  patchProp(el, key, prevValue, nextValue) {
    // Handle event listeners
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, nextValue);
    } else {
      // Set regular attributes
      window.__SetAttribute(el, key, nextValue);
    }
  },

  // Insert element
  insert(child, parent, anchor) {
    if (anchor) {
      window.__InsertBefore(parent, child, anchor);
    } else {
      window.__AppendChild(parent, child);
    }
  },

  // Remove element
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      window.__RemoveChild(parent, el);
    }
  },

  // Create text node
  createText(text) {
    const textNode = window.__CreateElement('text');
    window.__SetText(textNode, text);
    return textNode;
  },

  // Create comment (not used in Lynx, but required for Vue renderer)
  createComment() {
    return window.__CreateElement('comment');
  },

  // Set text
  setText(node, text) {
    window.__SetText(node, text);
  },

  // Set element content text
  setElementText(el, text) {
    window.__SetElementText(el, text);
  },

  // Parent node
  parentNode(node) {
    return node.parentNode;
  },

  // Next sibling
  nextSibling(node) {
    return node.nextSibling;
  },

  // Select root element for mounting
  querySelector(selector) {
    return document.querySelector(selector);
  },
};

// Create Vue custom renderer for Lynx
export const lynxRenderer = createRenderer(rendererOptions);

// Create an app with the Lynx renderer
export function createLynxApp(rootComponent: any) {
  return lynxRenderer.createApp(rootComponent);
} 
