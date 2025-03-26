import type { LoaderContext } from 'webpack';

export default function (this: LoaderContext<any>, source: string): void {
	const callback = this.async();

	try {
		const importMatches = source.matchAll(
			/<import\s+name="([^"]+)"\s+src="([^"]+)"\s*\/>/g
		);
		const imports = Array.from(importMatches).map((match) => ({
			name: match[1],
			src: match[2]
		}));

		const importStatements = imports
			.map((imp) => `import ${imp.name} from ${JSON.stringify(imp.src)};`)
			.join('\n');

		const viewMatch = source.match(/<view([^>]*)>([\s\S]*?)<\/view>/);
		const viewAttrs = viewMatch ? viewMatch[1] : '';
		const viewContent = viewMatch ? viewMatch[2] : '';

		const result = `
      ${importStatements}
      
      export default function createTemplate(root) {
        const viewElement = window.__CreateElement('view');
        
        const attrs = ${JSON.stringify(parseAttributes(viewAttrs))};
        for (const [key, value] of Object.entries(attrs)) {
          window.__SetAttribute(viewElement, key, value);
        }
        
        window.__SetElementText(viewElement, ${JSON.stringify(viewContent.trim())});
        
        return viewElement;
      }
    `;

		callback(null, result);
	} catch (err) {
		callback(err as Error);
	}
}

function parseAttributes(attrsString: string): Record<string, string> {
	const result: Record<string, string> = {};
	const matches = attrsString.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g);

	for (const match of matches) {
		const [_, key, value] = match;
		result[key] = value;
	}

	return result;
} 
