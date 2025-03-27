throw new Error(
	"The 'background-only' module cannot be imported from the main thread. " +
		'This module is restricted to the background thread only.'
);
