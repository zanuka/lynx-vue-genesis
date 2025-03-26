/**
 * CSS Loader for Vue Lynx - ignore CSS in main thread
 *
 * This loader replaces CSS imports with empty exports in the main thread,
 * so that CSS files don't get processed or included in the main bundle.
 */

module.exports = function () {
	return `export default {};
export const locals = {};`;
};
