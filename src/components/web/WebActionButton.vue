<template>
	<view class="web-action-button" @click="handleClick">
		<text class="button-text">{{ label }}</text>
	</view>
</template>

<script>
export default {
	name: 'WebActionButton',
	props: {
		label: {
			type: String,
			required: true
		},
		onPress: {
			type: Function,
			default: () => {}
		}
	},
	methods: {
		handleClick() {
			this.onPress();
			console.log('Web-specific button clicked');
		}
	}
};
</script>

<style>
.web-action-button {
	background-color: #4285f4; /* Web blue */
	border-radius: 4px;
	padding: 10px 20px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	margin: 8px;
	transition:
		background-color 0.2s,
		box-shadow 0.2s;
}

.web-action-button:hover {
	background-color: #3367d6;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.button-text {
	color: white;
	font-weight: 500;
	font-size: 14px;
}
</style>
