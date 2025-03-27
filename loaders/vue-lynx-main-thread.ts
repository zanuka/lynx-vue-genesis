import { threadMarker } from './thread-marker.js';

export default function mainThreadLoader(source: string): string {
	this.Layer = this.query.layer || 'vue-main-thread';
	const marker = threadMarker.generateMainThreadMarker();
	return `${marker}\n${source}`;
}
