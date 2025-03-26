<!-- 
	This component demonstrates a counter using Lynx elements
	It uses a dual-thread architecture:
	- Template (main thread): Handles rendering and user interactions
	- Script (worker thread): Handles state and business logic
-->
<template>
	<view class="counter-container">
		<text class="counter-title">Lynx Counter Demo</text>
		<text class="counter-value">Count: {{ count }}</text>
		<view class="button-row">
			<button @click="decrement">-</button>
			<button @click="increment">+</button>
			<button @click="reset">Reset</button>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

// Debug logging
console.log('LynxCounter component is being loaded');

export default defineComponent({
	name: 'LynxCounter',
	setup() {
		console.log('LynxCounter setup started');
		
		const count = ref(0);

		function increment() {
			count.value++;
			console.log('Count incremented to:', count.value);
			// In a real Lynx setup, this would send a message to the worker:
			// worker.postMessage({ type: 'METHOD_CALL', method: 'increment' });
		}

		function decrement() {
			count.value--;
			console.log('Count decremented to:', count.value);
			// In a real Lynx setup:
			// worker.postMessage({ type: 'METHOD_CALL', method: 'decrement' });
		}

		function reset() {
			count.value = 0;
			console.log('Count reset to:', count.value);
			// In a real Lynx setup:
			// worker.postMessage({ type: 'METHOD_CALL', method: 'reset' });
		}

		console.log('LynxCounter setup completed');

		return {
			count,
			increment,
			decrement,
			reset
		};
	},
	mounted() {
		console.log('LynxCounter mounted');
	}
});
</script>

<style>
.counter-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background-color: #f5f5f5;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin: 2rem auto;
	max-width: 400px;
}

.counter-title {
	font-size: 1.5rem;
	font-weight: bold;
	margin-bottom: 1rem;
	color: #333;
}

.counter-value {
	font-size: 2rem;
	font-weight: bold;
	margin: 1rem 0;
	color: #0066cc;
}

.button-row {
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
}

button {
	background-color: #0066cc;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s;
}

button:hover {
	background-color: #0055aa;
}
</style>
