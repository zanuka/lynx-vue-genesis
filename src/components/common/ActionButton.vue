<template>
	<view>
		<!-- This is a platform-agnostic wrapper that delegates to the appropriate platform-specific button -->
		<AndroidActionButton v-if="isAndroid" :label="label" :onPress="onPress" />
		<iOSActionButton v-else-if="isIOS" :label="label" :onPress="onPress" />
		<WebActionButton v-else :label="label" :onPress="onPress" />
	</view>
</template>

<script>
import { AndroidActionButton } from '../android';
import { iOSActionButton } from '../ios';
import { WebActionButton } from '../web';

export default {
	name: 'ActionButton',
	components: {
		AndroidActionButton,
		iOSActionButton,
		WebActionButton
	},
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
	computed: {
		isAndroid() {
			return (
				typeof window !== 'undefined' &&
				window.__LYNX__ &&
				window.__LYNX__.platform === 'android'
			);
		},
		isIOS() {
			return (
				typeof window !== 'undefined' &&
				window.__LYNX__ &&
				window.__LYNX__.platform === 'ios'
			);
		}
	}
};
</script>
