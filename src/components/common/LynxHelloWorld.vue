<!-- 
  This component is a Lynx version of HelloWorld.vue
  It converts standard HTML elements to Lynx equivalents and adds debugging
-->
<template>
	<view class="container">
		<text class="heading">{{ msg }}</text>
		
		<view class="content-card">
			<view class="feature-list">
				<view class="feature-item">
					<text class="bullet">•</text>
					<view class="feature-content">
						<text class="feature-title">Vue-Centric Architecture</text>
						<text class="feature-description">Full focus on Vue 3 components with Lynx integration</text>
					</view>
				</view>
				
				<view class="feature-item">
					<text class="bullet">•</text>
					<view class="feature-content">
						<text class="feature-title">Hybrid Configuration</text>
						<text class="feature-description">Experimental @rsbuild/plugin-vue along with custom Lynx configuration</text>
					</view>
				</view>
				
				<view class="feature-item">
					<text class="bullet">•</text>
					<view class="feature-content">
						<text class="feature-title">iOS/Android Support</text>
						<text class="feature-description">Cross-platform mobile development from a single Vue codebase</text>
					</view>
				</view>
				
				<view class="feature-item">
					<text class="bullet">•</text>
					<view class="feature-content">
						<text class="feature-title">Component-Based Design</text>
						<text class="feature-description">Structured for optimal reuse across platforms</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';

// Add debugging logs
console.log('LynxHelloWorld script execution started');

// Define props using the script setup syntax
const props = defineProps({
	msg: {
		type: String,
		default: 'Hello, Lynx + Vue!',
	},
});

// Log props in setup context
console.log('LynxHelloWorld setup function called with props:', props);

// Log when setup is complete
console.log('LynxHelloWorld setup completed');

// Lifecycle hooks with Composition API
onMounted(() => {
	console.log('LynxHelloWorld component mounted');
});

onUpdated(() => {
	console.log('LynxHelloWorld component updated');
});
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding: 2rem 1.5rem;
}

.heading {
	font-size: 1rem;
	font-weight: 700;
	color: black; /* Tailwind teal-700 */
	margin-bottom: 1.5rem;
	text-align: center;
}

.content-card {
	background-color: #f8fafc; /* Tailwind slate-50 */
	border-radius: 0.75rem;
	padding: 1.5rem;
	width: 100%;
	max-width: 36rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	border: 1px solid #e2e8f0; /* Tailwind slate-200 */
}

.intro-text {
	font-size: 1.125rem;
	color: #334155; /* Tailwind slate-700 */
	margin-bottom: 1.25rem;
	line-height: 1.6;
}

.highlight {
	font-weight: 700;
	color: #0f766e; /* Tailwind teal-700 */
}

.feature-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1rem;
}

.feature-item {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 0.5rem;
}

.bullet {
	color: #0f766e; /* Tailwind teal-700 */
	font-size: 1.25rem;
	line-height: 1.2;
	font-weight: 700;
}

.feature-content {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.feature-title {
	font-weight: 600;
	color: #0f172a; /* Tailwind slate-900 */
	font-size: 1.05rem;
}

.feature-description {
	color: #475569; /* Tailwind slate-600 */
	font-size: 0.95rem;
	line-height: 1.5;
}
</style>
