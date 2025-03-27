/**
 * Type definitions for Lynx framework
 */

declare global {
	// Define LynxElement as an alias for Element
	type LynxElement = Element;

	interface Window {
		lynx?: {
			platform: 'ios' | 'android' | 'web';
			createElement?: (tagName: string, options?: ElementCreationOptions) => LynxElement;
			appendChild?: (parent: Node, child: Node) => Node;
			setAttribute?: (element: Element, name: string, value: string) => void;
			[key: string]: any;
		};
	}
}

export { };

