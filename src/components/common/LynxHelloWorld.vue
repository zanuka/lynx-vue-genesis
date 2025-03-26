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

<script lang="ts">
import { defineComponent } from 'vue';

// Add debugging logs
console.log('LynxHelloWorld script execution started');

export default defineComponent({
	name: 'LynxHelloWorld',
	props: {
		msg: {
			type: String,
			default: 'Hello, Lynx + Vue!',
		},
	},
	setup(props) {
		console.log('LynxHelloWorld setup function called with props:', props);
		
		// Log when setup is complete
		console.log('LynxHelloWorld setup completed');
	},
	mounted() {
		console.log('LynxHelloWorld component mounted');
	},
	updated() {
		console.log('LynxHelloWorld component updated');
	},
});
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background-color: #f5f5f5;
	border-radius: 8px;
	margin: 2rem auto;
	max-width: 400px;
}

.heading {
	font-size: 2rem;
	font-weight: bold;
	color: #42b983;
	margin-bottom: 1rem;
}

.text {
	font-size: 1.2rem;
	color: #555;
}
</style>
