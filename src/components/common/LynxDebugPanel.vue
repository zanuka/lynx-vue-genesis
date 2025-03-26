<!-- 
  Debug panel for Lynx integration that shows thread communication
-->
<template>
	<view class="debug-container">
		<text class="debug-title">Lynx Debug Panel</text>
		<view class="debug-section">
			<text class="section-label">Environment</text>
			<text class="debug-info">{{ environment }}</text>
		</view>
		<view class="debug-section">
			<text class="section-label">Platform</text>
			<text class="debug-info">{{ platform }}</text>
		</view>
		<view class="debug-section">
			<text class="section-label">Time</text>
			<text class="debug-info">{{ currentTime }}</text>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'LynxDebugPanel',
	setup() {
		console.log('LynxDebugPanel setup started');
		
		const currentTime = ref(new Date().toLocaleTimeString());
		const platform = ref('Lynx iOS');
		const environment = ref(process.env.NODE_ENV || 'development');
		
		let timer: number | null = null;
		
		onMounted(() => {
			console.log('LynxDebugPanel mounted');
			// Update time every second
			timer = window.setInterval(() => {
				currentTime.value = new Date().toLocaleTimeString();
			}, 1000);
		});
		
		onBeforeUnmount(() => {
			console.log('LynxDebugPanel unmounting');
			// Clean up interval
			if (timer !== null) {
				clearInterval(timer);
			}
		});

		console.log('LynxDebugPanel setup completed');

		return {
			currentTime,
			platform,
			environment
		};
	}
});
</script>

<style>
.debug-container {
	background-color: #f8f8f8;
	border: 1px solid #ddd;
	border-radius: 6px;
	padding: 15px;
	margin: 20px 0;
	font-family: monospace;
}

.debug-title {
	font-size: 18px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 15px;
	color: #333;
}

.debug-section {
	margin-bottom: 10px;
	padding: 5px;
	border-bottom: 1px dotted #eee;
}

.section-label {
	font-size: 14px;
	font-weight: bold;
	color: #555;
	margin-bottom: 5px;
}

.debug-info {
	font-size: 14px;
	color: #0066cc;
}
</style>
