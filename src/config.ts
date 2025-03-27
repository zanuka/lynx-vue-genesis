export const CONFIG = {
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	API_HOST: import.meta.env.VITE_API_HOST || '',
	API: {
		TIMEOUT: 10000, // 10 seconds
		VERSION: 'v1', // API version
		DEFAULT_HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		RETRY_ATTEMPTS: 3
	}
};

export type ConfigType = typeof CONFIG;
