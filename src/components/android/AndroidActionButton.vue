<template>
	<view class="android-action-button" @click="handleClick">
		<text class="button-text">{{ label }}</text>
	</view>
</template>

<script>
export default {
	name: 'AndroidActionButton',
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
			console.log('Android-specific button clicked');
		}
	}
};
</script>

<style>
.android-action-button {
	background-color: #1a73e8; /* Android blue */
	border-radius: 4px;
	padding: 8px 16px;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Cross-platform shadow instead of elevation */
	margin: 8px;
}

.button-text {
	color: white;
	font-weight: 500;
	font-size: 14px;
	text-transform: uppercase;
	letter-spacing: 1px;
}
</style>
