interface VueLynxRuntimeOptions {
	debug?: boolean;
}

interface VueLynxRuntime {
	init: (options?: VueLynxRuntimeOptions) => void;
	reportFirstScreenTiming: () => void;
}

declare global {
	interface Window {
		__VUE_LYNX_RUNTIME__?: VueLynxRuntime;
	}
}

export { };
