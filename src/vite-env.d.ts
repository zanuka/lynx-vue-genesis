/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<Record<string, unknown>, Record<string, never>, unknown>;
	export default component;
}
