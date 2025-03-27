import type { RendererOptions } from 'vue';
import { createRenderer } from 'vue';

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

const rendererOptions: RendererOptions<any, any> = {
  createElement(type) {
    return window.__CreateElement(type);
  },

  patchProp(el, key, prevValue, nextValue) {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, nextValue);
    } else {
      window.__SetAttribute(el, key, nextValue);
    }
  },

  insert(child, parent, anchor) {
    if (anchor) {
      window.__InsertBefore(parent, child, anchor);
    } else {
      window.__AppendChild(parent, child);
    }
  },

  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      window.__RemoveChild(parent, el);
    }
  },

  createText(text) {
    const textNode = window.__CreateElement('text');
    window.__SetText(textNode, text);
    return textNode;
  },

  createComment() {
    return window.__CreateElement('comment');
  },

  setText(node, text) {
    window.__SetText(node, text);
  },

  setElementText(el, text) {
    window.__SetElementText(el, text);
  },

  parentNode(node) {
    return node.parentNode;
  },

  nextSibling(node) {
    return node.nextSibling;
  },

  querySelector(selector) {
    return document.querySelector(selector);
  },
};

export const lynxRenderer = createRenderer(rendererOptions);

export function createLynxApp(rootComponent: any) {
  return lynxRenderer.createApp(rootComponent);
} 
