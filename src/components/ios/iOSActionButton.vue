<template>
	<view class="ios-action-button" @click="handleClick">
		<text class="button-text">{{ label }}</text>
	</view>
</template>

<script>
export default {
	name: 'IOSActionButton',
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
			console.log('iOS-specific button clicked');
		}
	}
};
</script>

<style>
.ios-action-button {
	background-color: #0a84ff; /* iOS blue */
	border-radius: 10px;
	padding: 10px 20px;
	align-items: center;
	justify-content: center;
	margin: 8px;
}

.button-text {
	color: white;
	font-weight: 500;
	font-size: 16px;
}
</style>
