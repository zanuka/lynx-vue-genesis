// A simple webpack loader for .lynx files
// This is just a placeholder - a real implementation would need to parse Lynx templates properly
import type { LoaderContext } from 'webpack';

export default function (this: LoaderContext<any>, source: string): void {
	const callback = this.async();

	try {
		// This is a simplified transformer - in reality, you'd need to properly parse the Lynx XML
		// and transform it to JavaScript that the Lynx runtime can understand

		// Extract imports
		const importMatches = source.matchAll(
			/<import\s+name="([^"]+)"\s+src="([^"]+)"\s*\/>/g
		);
		const imports = Array.from(importMatches).map((match) => ({
			name: match[1],
			src: match[2]
		}));

		// Generate import statements
		const importStatements = imports
			.map((imp) => `import ${imp.name} from ${JSON.stringify(imp.src)};`)
			.join('\n');

		// Extract the main view content (simplistic approach)
		const viewMatch = source.match(/<view([^>]*)>([\s\S]*?)<\/view>/);
		const viewAttrs = viewMatch ? viewMatch[1] : '';
		const viewContent = viewMatch ? viewMatch[2] : '';

		// Transform to JavaScript
		// In a real implementation, this would be much more complex and would
		// transform the Lynx template into proper code for the Lynx runtime
		const result = `
      ${importStatements}
      
      // Transformed from Lynx template
      export default function createTemplate(root) {
        // This is a placeholder for actual Lynx template transformation
        // A real implementation would create a proper Lynx element tree
        const viewElement = window.__CreateElement('view');
        
        // Set attributes
        const attrs = ${JSON.stringify(parseAttributes(viewAttrs))};
        for (const [key, value] of Object.entries(attrs)) {
          window.__SetAttribute(viewElement, key, value);
        }
        
        // Add content (simplified)
        // In a real implementation, we would recursively process all child elements
        window.__SetElementText(viewElement, ${JSON.stringify(viewContent.trim())});
        
        return viewElement;
      }
    `;

		callback(null, result);
	} catch (err) {
		callback(err as Error);
	}
}

// Helper function to parse attributes
function parseAttributes(attrsString: string): Record<string, string> {
	const result: Record<string, string> = {};
	const matches = attrsString.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g);

	for (const match of matches) {
		const [_, key, value] = match;
		result[key] = value;
	}

	return result;
} 
