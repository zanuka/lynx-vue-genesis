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
				<text v-if="state.message" class="state-item"
					>Message: {{ state.message }}</text
				>
			</view>
		</view>

		<view class="debug-actions">
			<button @click="sendMessage" class="debug-button">
				Send Test Message
			</button>
			<button @click="clearLogs" class="debug-button">Clear Logs</button>
		</view>

		<!-- New features section -->
		<view class="features-section">
			<text class="section-title">demonstrate the following features:</text>
			<view class="feature-list">
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text"
						>Main thread/worker thread separation for UI performance</text
					>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text"
						>Async message-based communication between threads</text
					>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text"
						>Real-time state synchronization across thread boundaries</text
					>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text"
						>Bidirectional message flow with timestamps</text
					>
				</view>
				<view class="feature-item">
					<text class="bullet">•</text>
					<text class="feature-text"
						>Live monitoring of the Lynx thread communication model</text
					>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

const MAX_LOGS = 10;

console.log('LynxDebugPanel setup started');

const currentTime = ref<string>(new Date().toLocaleTimeString());
const platform = ref<string>('Unknown');
const environment = ref<string>(process.env.NODE_ENV || 'development');

// Logs for each thread
const mainThreadLogs = ref<string[]>([]);
const workerThreadLogs = ref<string[]>([]);

// Current state
interface State {
	count: number;
	lastUpdated: string;
	message: string;
}

const state = reactive<State>({
	count: 0,
	lastUpdated: 'Not yet updated',
	message: ''
});

// Add a log to the main thread logs
function addMainThreadLog(message: string): void {
	console.log('Main thread log:', message);
	mainThreadLogs.value = [message, ...mainThreadLogs.value].slice(
		0,
		MAX_LOGS
	);
}

// Add a log to the worker thread logs
function addWorkerThreadLog(message: string): void {
	console.log('Worker thread log:', message);
	workerThreadLogs.value = [message, ...workerThreadLogs.value].slice(
		0,
		MAX_LOGS
	);
}

// Update the state
function updateState(newState: Partial<State>): void {
	console.log('Updating state:', newState);
	Object.assign(state, newState);
}

// Send a test message to the worker
function sendMessage(): void {
	const message = `Test message at ${new Date().toLocaleTimeString()}`;
	addMainThreadLog(`Sending: ${message}`);

	// Normally we would send this to the worker, but for the demo we'll just simulate it
	setTimeout(() => {
		addWorkerThreadLog(`Received: ${message}`);
		updateState({
			message,
			lastUpdated: new Date().toISOString()
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
function clearLogs(): void {
	mainThreadLogs.value = [];
	workerThreadLogs.value = [];
}

// Initialize with some starter logs
addMainThreadLog('Debug panel initialized');
addWorkerThreadLog('Worker ready');

console.log('Debug panel setup completed');

let timer: number | null = null;

onMounted(() => {
	console.log('LynxDebugPanel mounted');
	// Update time every second
	timer = window.setInterval(() => {
		currentTime.value = new Date().toLocaleTimeString();
	}, 1000);

	// Check if we're in a Lynx native environment
	if (typeof window !== 'undefined') {
		if (typeof window.lynx !== 'undefined') {
			// Check specific Lynx platform if available
			if (window.lynx.platform) {
				platform.value = `Lynx ${window.lynx.platform}`;
			} else {
				platform.value = 'Lynx Native';
			}
		} else {
			// We're in a web browser
			platform.value = 'Lynx Web';
		}
		
		// Additional checks for development mode URLs
		const url = window.location.href;
		if (url.includes('localhost') || url.includes('127.0.0.1')) {
			if (url.includes('lynx.html')) {
				platform.value = 'Lynx Web (Development)';
			}
		}
	}
});

onBeforeUnmount(() => {
	console.log('LynxDebugPanel unmounting');
	// Clean up interval
	if (timer !== null) {
		clearInterval(timer);
	}
});

console.log('LynxDebugPanel setup completed');
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
