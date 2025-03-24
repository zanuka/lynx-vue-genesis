<template>
	<view class="container">
		<view class="section">
			<text class="section-title">Primary Dependencies</text>
			<view class="grid">
				<view class="card">
					<text class="card-title">Vue 3</text>
					<text class="card-subtitle">^3.4.37</text>
				</view>
				<view class="card">
					<text class="card-title">TypeScript</text>
					<text class="card-subtitle">~5.5.4</text>
				</view>
				<view class="card">
					<text class="card-title">Vite</text>
					<text class="card-subtitle">^5.4.0</text>
				</view>
				<view class="card">
					<text class="card-title">Tailwind CSS</text>
					<text class="card-subtitle">^3.4.1</text>
				</view>
				<view class="card">
					<text class="card-title">Pinia</text>
					<text class="card-subtitle">^2.2.1</text>
				</view>
				<view class="card">
					<text class="card-title">Vue Router</text>
					<text class="card-subtitle">^4.4.3</text>
				</view>
			</view>
		</view>

		<view class="section">
			<text class="section-title">Development Dependencies</text>
			<view class="grid">
				<view class="card">
					<text class="card-title">Vitest</text>
					<text class="card-subtitle">^2.1.9</text>
				</view>
				<view class="card">
					<text class="card-title">ESLint</text>
					<text class="card-subtitle">^8.57.1</text>
				</view>
				<view class="card">
					<text class="card-title">Prettier</text>
					<text class="card-subtitle">^3.3.3</text>
				</view>
				<view class="card">
					<text class="card-title">Cypress</text>
					<text class="card-subtitle">^13.13.2</text>
				</view>
				<view class="card">
					<text class="card-title">@vue/test-utils</text>
					<text class="card-subtitle">^2.4.6</text>
				</view>
				<view class="card">
					<text class="card-title">@testing-library/vue</text>
					<text class="card-subtitle">^8.1.0</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// Add debugging logs
console.log('LynxFooter script execution started');

export default {
	name: 'LynxFooter',
	props: {
		msg: {
			type: String,
			default: 'Hello, Lynx + Vue!'
		}
	},
	setup(props) {
		console.log('LynxFooter setup function called with props:', props);

		// Log when setup is complete
		console.log('LynxFooter setup completed');
	},
	mounted() {
		console.log('LynxFooter component mounted');
	},
	updated() {
		console.log('LynxFooter component updated');
	}
};
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20px;
}

.heading {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
}

.section {
	margin-top: 32px;
	margin-bottom: 24px;
	width: 100%;
}

.section-title {
	font-size: 20px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 16px;
}

.grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.card {
	background-color: white;
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #f3f4f6;
	transition: box-shadow 0.3s;
	flex: 1;
	min-width: 200px;
}

.card-title {
	font-weight: 500;
	color: #111827;
}

.card-subtitle {
	font-size: 14px;
	color: #6b7280;
}

.text {
	margin-top: 8px;
	color: #4b5563;
}

.button-container {
	margin-top: 8px;
	margin-bottom: 24px;
}

.button {
	background-color: #10b981;
	color: white;
	font-weight: 500;
	padding: 8px 16px;
	border-radius: 6px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	transition: background-color 0.2s;
}

.code-text {
	color: #4b5563;
	background-color: #f9fafb;
	padding: 16px;
	border-radius: 8px;
	border: 1px solid #f3f4f6;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
