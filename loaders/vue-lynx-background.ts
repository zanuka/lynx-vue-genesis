import { threadMarker } from './thread-marker.js';

export default function backgroundLoader(source: string): string {
	this.Layer = this.query.layer || 'vue-background';
	const marker = threadMarker.generateBackgroundMarker();
	return `${marker}\n${source}`;
}
