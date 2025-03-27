<template>
	<div>
		<h1>{{ msg }}</h1>

		<div class="mt-8 mb-6">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">
				Primary Dependencies
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Vue 3</h3>
					<p class="text-sm text-gray-600">^3.4.37</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">TypeScript</h3>
					<p class="text-sm text-gray-600">~5.5.4</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Vite</h3>
					<p class="text-sm text-gray-600">^5.4.0</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Tailwind CSS</h3>
					<p class="text-sm text-gray-600">^3.4.1</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Pinia</h3>
					<p class="text-sm text-gray-600">^2.2.1</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Vue Router</h3>
					<p class="text-sm text-gray-600">^4.4.3</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">@headlessui/vue</h3>
					<p class="text-sm text-gray-600">^1.7.19</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">@heroicons/vue</h3>
					<p class="text-sm text-gray-600">^2.1.1</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">@vueuse/core</h3>
					<p class="text-sm text-gray-600">^10.9.0</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">axios</h3>
					<p class="text-sm text-gray-600">^1.6.8</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">marked</h3>
					<p class="text-sm text-gray-600">^14.0.0</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Lynx JS</h3>
					<p class="text-sm text-gray-600">Multiple packages</p>
				</div>
			</div>
		</div>

		<div class="mt-8 mb-6">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">
				Development Dependencies
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Vitest</h3>
					<p class="text-sm text-gray-600">^2.1.9</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">ESLint</h3>
					<p class="text-sm text-gray-600">^8.57.1</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Prettier</h3>
					<p class="text-sm text-gray-600">^3.3.3</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">Cypress</h3>
					<p class="text-sm text-gray-600">^13.13.2</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">@vue/test-utils</h3>
					<p class="text-sm text-gray-600">^2.4.6</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">@testing-library/vue</h3>
					<p class="text-sm text-gray-600">^8.1.0</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">TypeScript</h3>
					<p class="text-sm text-gray-600">~5.5.4</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">webpack</h3>
					<p class="text-sm text-gray-600">^5.98.0</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">happy-dom</h3>
					<p class="text-sm text-gray-600">^14.12.3</p>
				</div>
				<div
					class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
				>
					<h3 class="font-medium text-gray-900">msw</h3>
					<p class="text-sm text-gray-600">^2.4.8</p>
				</div>
			</div>
		</div>

		<p class="mt-2">
			Created by <a href="https://github.com/zanuka" target="_blank">zanuka</a>
		</p>

		<p class="mt-2">
			<a href="https://vitejs.dev/guide/features.html" target="_blank"
				>Vite Docs</a
			>
			|
			<a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
		</p>

		<div class="mt-2 mb-6">
			<button
				class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
				@click="count++"
			>
				count is: {{ count }}
			</button>
		</div>

		<p
			class="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
		>
			Edit
			<code class="bg-white px-2 py-1 rounded text-sm font-mono text-gray-800"
				>components/HelloWorld.vue</code
			>
			to test hot module replacement.
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
	name: 'HelloWorld',
	props: {
		msg: {
			type: String,
			required: true
		}
	},
	setup: () => {
		const count = ref(0);
		return { count };
	}
});
</script>

<style scoped>
a {
	color: #42b983;
}

label {
	margin: 0 0.5em;
	font-weight: bold;
}

code {
	background-color: #eee;
	padding: 2px 4px;
	border-radius: 4px;
	color: #304455;
}
</style>
