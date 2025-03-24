// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare module '*.vue' {
	import { DefineComponent } from 'vue';
	export default DefineComponent;
}

declare interface Window {
	// extend the window
}

interface ImportMeta {
	env: {
		BASE_URL: string;
		VITE_API_HOST: string;
		VITE_MODE: string;
	};
}
