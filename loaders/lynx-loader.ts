/**
 * Custom loader for .lynx files
 * This loader handles the dual - format nature of.lynx files,
 * which can be Vue SFCs for web and get transformed for mobile platforms
 */

import { parse } from '@vue/compiler-sfc';
import { LoaderContext } from 'webpack';

/**
 * Main loader function
 * @param {string} source - The source code of the .lynx file
 * @return {string} - The transformed code
 */
export default function lynxLoader(this: LoaderContext<any>, source: string): void {
  const callback = this.async();

  try {
    // Log to help with debugging
    console.log(`Processing .lynx file: ${this.resourcePath}`);

    // Parse the Vue SFC
    const { descriptor } = parse(source);

    // Get the template, script, and style sections
    const template = descriptor.template ? descriptor.template.content.trim() : '';
    const script = descriptor.script ? descriptor.script.content.trim() : '';
    const scriptSetup = descriptor.scriptSetup ? descriptor.scriptSetup.content.trim() : '';

    // Determine if we're targeting mobile (Lynx) or web
    const isMobile =
      this.resourceQuery?.includes('mobile') || this.resourcePath?.includes('mobile.lynx');

    // For mobile platforms, convert to JSX
    if (isMobile) {
      // Extract imports from script
      const importMatches = (script || scriptSetup).match(/import.+?;/g) || [];
      const imports = importMatches.join('\n');

      const setupContent = scriptSetup.replace(/import.+?;/g, '').trim();

      // Extract the script content (excluding imports)
      const scriptContent = script.replace(/import.+?;/g, '').trim();

      // Convert template to JSX
      const jsxContent = convertTemplateToJSX(template);

      // Construct the final JSX output
      const finalCode = `
        ${imports}
        import React from 'react';
        
        ${setupContent}
        
        ${scriptContent}
        
        export default function LynxComponent() {
          return (
            ${jsxContent}
          );
        }
      `;

      callback(null, finalCode);
    } else {
      // For web, keep as Vue SFC
      callback(null, source);
    }
  } catch (error) {
    console.error('Error in lynx-loader:', error);
    callback(error as Error);
  }
}

/**
 * Converts Vue template to JSX
 * @param {string} template - Vue template string
 * @return {string} - JSX string
 */
function convertTemplateToJSX(template: string): string {
  // Simple transformation rules for demonstration
  return (
    template
      // Replace Vue's class with React's className
      .replace(/class="/g, 'className="')
      // Replace Vue's event binding syntax
      .replace(/@([a-zA-Z]+)="([^"]+)"/g, 'on$1={$2}')
      // Convert Vue's v-if to conditional rendering
      .replace(/v-if="([^"]+)"/g, '{$1 ? ')
      // Convert v-for
      .replace(/v-for="([^"]+) in ([^"]+)"/g, '{$2.map(($1) => ')
      // Handle component casing
      .replace(/<([a-z]+-[a-z]+)/g, '<$1')
  );
}
