// Detect the current platform and export the appropriate components
// This allows for platform-agnostic imports like: import { Component } from './components'

// Define the Lynx window interface
declare global {
  interface Window {
    __LYNX__?: {
      platform: string;
    };
  }
}

// Default to common components
import * as common from './common';

// Determine the platform and export the appropriate components
let platformExports;

// Check if we're running in a Lynx environment
if (typeof window !== 'undefined' && window.__LYNX__) {
  // Determine if we're on iOS or Android
  if (window.__LYNX__.platform === 'ios') {
    platformExports = require('./ios');
  } else if (window.__LYNX__.platform === 'android') {
    platformExports = require('./android');
  } else {
    // Default to web for any other platform
    platformExports = require('./web');
  }
} else {
  // We're in a standard web environment
  platformExports = require('./web');
}

// Export all components from the appropriate platform
export default {
  ...common,
  ...platformExports
};
