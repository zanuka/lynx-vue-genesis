<template>
	<view class="footer-container">
		<view class="section">
			<text class="section-title">Primary Dependencies</text>
			<view class="deps-grid">
				<view class="dep-item">
					<text class="dep-name">Vue</text>
					<text class="dep-version">^3.3.4</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">TypeScript</text>
					<text class="dep-version">~5.5.4</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Vite</text>
					<text class="dep-version">^5.4.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Tailwind</text>
					<text class="dep-version">^3.4.1</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Pinia</text>
					<text class="dep-version">^2.2.1</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Vue Router</text>
					<text class="dep-version">^4.4.3</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Headless UI</text>
					<text class="dep-version">^1.7.19</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Heroicons</text>
					<text class="dep-version">^2.1.1</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">VueUse</text>
					<text class="dep-version">^10.9.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Axios</text>
					<text class="dep-version">^1.6.8</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Marked</text>
					<text class="dep-version">^14.0.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Lynx Web Core</text>
					<text class="dep-version">^0.9.0</text>
				</view>
			</view>
		</view>

		<view class="section">
			<text class="section-title">Development Tools</text>
			<view class="deps-grid">
				<view class="dep-item">
					<text class="dep-name">ESLint</text>
					<text class="dep-version">^9.23.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Vitest</text>
					<text class="dep-version">^2.1.9</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Prettier</text>
					<text class="dep-version">^3.3.3</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Vue Test Utils</text>
					<text class="dep-version">^2.4.6</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Testing Library</text>
					<text class="dep-version">^8.1.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Webpack</text>
					<text class="dep-version">^5.98.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Happy DOM</text>
					<text class="dep-version">^14.12.3</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">MSW</text>
					<text class="dep-version">^2.4.8</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">PostCSS</text>
					<text class="dep-version">~8.4.38</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Rspeedy</text>
					<text class="dep-version">^0.8.5</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Bun</text>
					<text class="dep-version">>=1.0.0</text>
				</view>
				<view class="dep-item">
					<text class="dep-name">Node</text>
					<text class="dep-version">>=20</text>
				</view>
			</view>
		</view>
		<text class="footer-text">Vue Lynx Genesis &copy; {{ currentYear }}</text>
		<text class="version-text">Version: 0.1.1</text>
	</view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated } from 'vue';

console.log('LynxFooter setup function called');

// Computed property for the current year
const currentYear = computed<number>(() => {
	return new Date().getFullYear();
});

// Log when setup is complete
console.log('LynxFooter setup completed');

// Lifecycle hooks
onMounted(() => {
	console.log('LynxFooter component mounted');
});

onUpdated(() => {
	console.log('LynxFooter component updated');
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
	background-color: #f8fafc;
	border-top: 1px solid #e2e8f0;
}

.section {
	margin: 16px 0;
	width: 100%;
	max-width: 1000px;
}

.section-title {
	font-size: 18px;
	font-weight: 600;
	color: #334155;
	margin-bottom: 12px;
	padding-bottom: 4px;
	border-bottom: 1px solid #e2e8f0;
}

/* New compact grid layout */
.deps-grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 8px;
}

.dep-item {
	padding: 8px;
	background-color: #f1f5f9;
	border-radius: 4px;
	border: 1px solid #e2e8f0;
}

.dep-name {
	font-size: 14px;
	font-weight: 500;
	color: #0f172a;
}

.dep-version {
	font-size: 12px;
	color: #64748b;
}

.footer-text {
	font-size: 14px;
	color: #64748b;
	margin-top: 24px;
}

.version-text {
	font-size: 12px;
	margin-top: 4px;
	color: #94a3b8;
}

/* For smaller screens */
@media (max-width: 1024px) {
	.deps-grid {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (max-width: 768px) {
	.deps-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 480px) {
	.deps-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>
