/**
 * Thread marker utilities for Lynx
 * Helps annotate code for different thread execution
 */

export const threadMarker = {
	/**
	 * Generate a marker for main thread
	 */
	generateMainThreadMarker(): string {
		return '// @lynx-main-thread';
	},

	/**
	 * Generate a marker for background thread
	 */
	generateBackgroundMarker(): string {
		return '// @lynx-background-thread';
	},
};
