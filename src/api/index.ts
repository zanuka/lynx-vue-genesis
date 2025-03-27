/**
 * Vue-Lynx API client
 * Provides a client for making API requests
 */

// Import the API service
import apiService from '../services/api';

// Define types
interface ApiResponse<T = any> {
	data?: T;
	success: boolean;
	error?: string;
}

// Re-export the API service
export const api = apiService;

// API client implementation
export const apiClient = {
	/**
	 * Perform a GET request
	 */
	async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
		console.log(`GET request to ${endpoint}`);
		// In a real implementation, this would make an actual HTTP request
		try {
			const data = await api.getPosts();
			return { success: true, data: data as unknown as T };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	},

	/**
	 * Perform a POST request
	 */
	async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
		console.log(`POST request to ${endpoint} with data:`, data);
		// In a real implementation, this would make an actual HTTP request
		try {
			const response = await api.submitForm(data);
			return { success: true, data: response.data as T };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	},
};

export default apiClient;
