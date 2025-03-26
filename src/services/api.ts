/**
 * Vue-Lynx API Service
 * Basic implementation of an API service for the Vue-Lynx integration
 */

// Define types for API responses
interface User {
	id: number | string;
	name: string;
	email: string;
}

interface Post {
	id: number;
	title: string;
	body: string;
}

interface FormResponse {
	success: boolean;
	data: any;
}

// Simulate API request with delay
const simulateRequest = <T>(data: T, delay: number = 500): Promise<T> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), delay);
	});
};

// API methods
export const api = {
	/**
	 * Get user data
	 */
	async getUser(id: number | string): Promise<User> {
		return simulateRequest({
			id,
			name: `User ${id}`,
			email: `user${id}@example.com`,
		});
	},

	/**
	 * Get posts
	 */
	async getPosts(): Promise<Post[]> {
		return simulateRequest([
			{ id: 1, title: 'Lynx Vue Integration', body: 'A seamless integration between Vue and Lynx' },
			{ id: 2, title: 'Mobile Development', body: 'Creating mobile apps with Vue and Lynx' },
		]);
	},

	/**
	 * Submit a form
	 */
	async submitForm(data: any): Promise<FormResponse> {
		return simulateRequest({ success: true, data });
	},
};

export default api;
