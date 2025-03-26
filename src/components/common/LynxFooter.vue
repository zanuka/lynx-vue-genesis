<template>
	<view class="footer-container">
		<text class="footer-text">Vue Lynx Genesis &copy; {{ currentYear }}</text>
		<text class="version-text">Version: 0.1.1</text>
	</view>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'LynxFooter',
	setup() {
		console.log('LynxFooter setup function called');
		
		const currentYear = computed(() => {
			return new Date().getFullYear();
		});
		
		// Log when setup is complete
		console.log('LynxFooter setup completed');
		
		return {
			currentYear
		};
	}
});
</script>

<style>
.footer-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	margin-top: 30px;
	background-color: #f5f5f5;
	border-top: 1px solid #e0e0e0;
}

.footer-text {
	font-size: 14px;
	color: #666;
}

.version-text {
	font-size: 12px;
	margin-top: 5px;
	color: #999;
}
</style>
