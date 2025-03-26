<!-- 
  This component is a Lynx version of HelloWorld.vue
  It converts standard HTML elements to Lynx equivalents and adds debugging
-->
<template>
	<view class="container">
		<text class="heading">{{ msg }}</text>
		<text class="text"> Created by Zanuka </text>
	</view>
</template>

<script>
import { ref } from 'vue';

// Add debugging logs
console.log('LynxHelloWorld script execution started');

export default {
	name: 'LynxHelloWorld',
	props: {
		msg: {
			type: String,
			default: 'Hello, Lynx + Vue!',
		},
	},
	setup(props) {
		console.log('LynxHelloWorld setup function called with props:', props);

		const count = ref(0);

		function increment() {
			count.value++;
			console.log('Count incremented to:', count.value);

			// In a real Lynx implementation, we would send a message to the worker thread
			console.log('Would send INCREMENT message to worker thread');
		}

		// Log when setup is complete
		console.log('LynxHelloWorld setup completed');

		return {
			count,
			increment,
		};
	},
	mounted() {
		console.log('LynxHelloWorld component mounted');
	},
	updated() {
		console.log('LynxHelloWorld component updated');
	},
};
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20px;
}

.heading {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
}

.section {
	margin-top: 32px;
	margin-bottom: 24px;
	width: 100%;
}

.section-title {
	font-size: 20px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 16px;
}

.grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.card {
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #f3f4f6;
	transition: box-shadow 0.3s;
	flex: 1;
	min-width: 200px;
}

.card-title {
	font-weight: 500;
	color: #111827;
}

.card-subtitle {
	font-size: 14px;
	color: #6b7280;
}

.text {
	margin-top: 8px;
	color: #4b5563;
}

.button-container {
	margin-top: 8px;
	margin-bottom: 24px;
}

.button {
	background-color: #10b981;
	color: white;
	font-weight: 500;
	padding: 8px 16px;
	border-radius: 6px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	transition: background-color 0.2s;
}

.code-text {
	color: #4b5563;
	background-color: #f9fafb;
	padding: 16px;
	border-radius: 8px;
	border: 1px solid #f3f4f6;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
