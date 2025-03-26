export const threadMarker = {
	generateMainThreadMarker(): string {
		return '// @lynx-main-thread';
	},
	generateBackgroundMarker(): string {
		return '// @lynx-background-thread';
	},
};
