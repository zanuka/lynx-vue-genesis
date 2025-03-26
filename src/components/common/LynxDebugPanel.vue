<!-- 
  Debug panel for Lynx integration that shows thread communication
-->
<template>
	<view class="debug-container">
		<text class="debug-title">Vue-Lynx Debug Panel</text>

		<view class="debug-section">
			<text class="section-label">Main Thread</text>
			<view class="log-container">
				<text
					v-for="(log, index) in mainThreadLogs"
					:key="index"
					class="log-item"
				>
					{{ log }}
				</text>
			</view>
		</view>

		<view class="debug-section">
			<text class="section-label">Worker Thread</text>
			<view class="log-container">
				<text
					v-for="(log, index) in workerThreadLogs"
					:key="index"
					class="log-item"
				>
					{{ log }}
				</text>
			</view>
		</view>

		<view class="debug-section">
			<text class="section-label">State</text>
			<view class="state-container">
				<text class="state-item">Count: {{ state.count }}</text>
				<text class="state-item">Last Updated: {{ state.lastUpdated }}</text>
				<text
					v-if="state.message"
					class="state-item"
					>Message: {{ state.message }}</text
				>
			</view>
		</view>

		<view class="debug-actions">
			<button
				class="debug-button"
				@click="sendMessage"
			>
				Send Test Message
			</button>
			<button
				class="debug-button"
				@click="clearLogs"
			>
				Clear Logs
			</button>
		</view>

		<!-- New features section -->
		<view class="features-section">
			<text class="section-title">demonstrate the following features:</text>
			<view class="feature-list">
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text">Main thread/worker thread separation for UI performance</text>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text">Async message-based communication between threads</text>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text">Real-time state synchronization across thread boundaries</text>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text">Bidirectional message flow with timestamps</text>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text">Live monitoring of the Lynx thread communication model</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { reactive, ref } from 'vue';

// Maximum number of logs to show
const MAX_LOGS = 10;

export default {
	name: 'LynxDebugPanel',
	setup() {
		console.log('Debug panel setup started');

		// Logs for each thread
		const mainThreadLogs = ref([]);
		const workerThreadLogs = ref([]);

		// Current state
		const state = reactive({
			count: 0,
			lastUpdated: 'Not yet updated',
			message: '',
		});

		// Add a log to the main thread logs
		function addMainThreadLog(message) {
			console.log('Main thread log:', message);
			mainThreadLogs.value = [message, ...mainThreadLogs.value].slice(0, MAX_LOGS);
		}

		// Add a log to the worker thread logs
		function addWorkerThreadLog(message) {
			console.log('Worker thread log:', message);
			workerThreadLogs.value = [message, ...workerThreadLogs.value].slice(0, MAX_LOGS);
		}

		// Update the state
		function updateState(newState) {
			console.log('Updating state:', newState);
			Object.assign(state, newState);
		}

		// Send a test message to the worker
		function sendMessage() {
			const message = `Test message at ${new Date().toLocaleTimeString()}`;
			addMainThreadLog(`Sending: ${message}`);

			// Normally we would send this to the worker, but for the demo we'll just simulate it
			setTimeout(() => {
				addWorkerThreadLog(`Received: ${message}`);
				updateState({
					message,
					lastUpdated: new Date().toISOString(),
				});

				// Simulate worker response
				setTimeout(() => {
					const response = `Response to "${message}"`;
					addWorkerThreadLog(`Sending: ${response}`);

					// Simulate main thread receiving response
					setTimeout(() => {
						addMainThreadLog(`Received: ${response}`);
					}, 300);
				}, 500);
			}, 300);
		}

		// Clear all logs
		function clearLogs() {
			mainThreadLogs.value = [];
			workerThreadLogs.value = [];
		}

		// Initialize with some starter logs
		addMainThreadLog('Debug panel initialized');
		addWorkerThreadLog('Worker ready');

		console.log('Debug panel setup completed');

		return {
			mainThreadLogs,
			workerThreadLogs,
			state,
			sendMessage,
			clearLogs,
		};
	},
};
</script>

<style>
.debug-container {
	background-color: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	padding: 16px;
	margin: 16px auto;
	max-width: 800px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.debug-title {
	font-size: 18px;
	font-weight: bold;
	color: #334155;
	margin-bottom: 16px;
	text-align: center;
}

.debug-section {
	margin-bottom: 16px;
	border: 1px solid #e2e8f0;
	border-radius: 6px;
	overflow: hidden;
}

.section-label {
	background-color: #e2e8f0;
	color: #334155;
	font-weight: 600;
	padding: 8px 12px;
	font-size: 14px;
}

.log-container {
	padding: 8px;
	background-color: #334155;
	color: #f8fafc;
	height: 150px;
	overflow-y: auto;
	font-family: monospace;
}

.log-item {
	font-size: 12px;
	padding: 2px 0;
	border-bottom: 1px solid #475569;
	white-space: pre-wrap;
}

.state-container {
	padding: 12px;
	background-color: #fff;
}

.state-item {
	font-size: 14px;
	margin-bottom: 4px;
}

.debug-actions {
	display: flex;
	gap: 8px;
	justify-content: center;
	margin-top: 12px;
}

.debug-button {
	background-color: #334155;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 12px;
	font-size: 14px;
	cursor: pointer;
}

.debug-button:hover {
	background-color: #475569;
}

.features-section {
	margin-top: 20px;
	background-color: #f3f4f6;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 16px;
}

.section-title {
	font-size: 18px;
	font-weight: bold;
	color: #374151;
	margin-bottom: 12px;
}

.feature-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.feature-item {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.bullet {
	font-size: 14px;
	font-weight: bold;
	margin-right: 8px;
}

.feature-text {
	font-size: 14px;
}
</style>
