/**
 * Error module for background-only imports in the main thread
 *
 * This will throw an error when imported from the main thread,
 * as background-only modules should not be used there.
 */

throw new Error(
	"The 'background-only' module cannot be imported from the main thread. " +
		'This module is restricted to the background thread only.'
);
