<template>
	<view class="container">
		<text class="title">Lynx Test Component</text>
		<text class="description">{{ message }}</text>
		<view
			class="button"
			@click="count++"
		>
			<text class="button-text">Count: {{ count }}</text>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'LynxTest',
	setup() {
		const count = ref(0);
		const message = ref('This is a simple Lynx component');

		return {
			count,
			message,
		};
	},
});
</script>

<style scoped>
.container {
	padding: 20px;
	background-color: #f0f0f0;
	border-radius: 10px;
}

.title {
	font-size: 24px;
	font-weight: bold;
	color: #333;
	margin-bottom: 10px;
}

.description {
	font-size: 16px;
	color: #666;
	margin-bottom: 20px;
}

.button {
	background-color: #42b983;
	padding: 10px 15px;
	border-radius: 5px;
	width: fit-content;
}

.button-text {
	color: white;
	font-weight: bold;
}
</style>
