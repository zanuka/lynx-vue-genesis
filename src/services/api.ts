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

const simulateRequest = <T>(data: T, delay: number = 500): Promise<T> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), delay);
	});
};

export const api = {
	async getUser(id: number | string): Promise<User> {
		return simulateRequest({
			id,
			name: `User ${id}`,
			email: `user${id}@example.com`,
		});
	},

	async getPosts(): Promise<Post[]> {
		return simulateRequest([
			{ id: 1, title: 'Lynx Vue Integration', body: 'A seamless integration between Vue and Lynx' },
			{ id: 2, title: 'Mobile Development', body: 'Creating mobile apps with Vue and Lynx' },
		]);
	},

	async submitForm(data: any): Promise<FormResponse> {
		return simulateRequest({ success: true, data });
	},
};

export default api;
