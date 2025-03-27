// This file serves as an entry point for the Lynx bundle
// It doesn't need any actual content, as the Lynx files will be processed separately
export default {};

// Lynx entry point that doesn't require React
import '@lynx-js/web-core';
import '@lynx-js/web-elements/all';

// This is the equivalent of root.render(<App />) for the web version
// We don't need any React-specific code here since we're using Vue
// The Lynx web bundle will be loaded by the lynx-view element in App.vue

if (import.meta.hot) {
	import.meta.hot.accept();
}
