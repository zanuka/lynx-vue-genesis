import { CONFIG } from '@/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Creates and configures an Axios instance with interceptors
 * @returns Configured Axios instance
 */
const createAxiosInstance = (): AxiosInstance => {
	const instance = axios.create({
		baseURL: CONFIG.API_HOST,
		timeout: 10000, // 10 seconds
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// Request interceptor
	instance.interceptors.request.use(
		(config) => {
			// Add authorization header if needed
			// const token = getAuthToken();
			// if (token) {
			//   config.headers['Authorization'] = `Bearer ${token}`;
			// }
			return config;
		},
		(error) => Promise.reject(error)
	);

	// Response interceptor
	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response) {
				// Handle specific HTTP error status codes
				switch (error.response.status) {
					case 401:
						// Handle unauthorized access
						break;
					// Add more cases as needed
				}
			}
			return Promise.reject(error);
		}
	);

	return instance;
};

export const getAxiosInstance = (): AxiosInstance => createAxiosInstance();
