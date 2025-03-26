<script setup lang="ts">
import { onMounted } from 'vue';
import HelloWorld from './components/common/HelloWorld.vue';

// Optional: Detect when Lynx is initialized
onMounted(() => {
	// The Lynx view custom element is loaded from the web-core and web-elements libraries
	// We can add custom event listeners as needed
	const lynxView = document.querySelector('lynx-view');
	if (lynxView) {
		lynxView.addEventListener('load', () => {
			console.log('Lynx view loaded');
		});
	}
});
</script>

<template>
	<div>
		<header>
			<nav>
				<router-link to="/">Home</router-link> |
				<a href="/lynx.html" target="_blank">Lynx Demo</a>
			</nav>
		</header>
		<router-view />
		<div class="flex justify-center items-center gap-8">
			<img alt="Vue logo" src="./assets/vue-vite-icon.webp" class="w-32 h-32" />
		</div>
		<h1 class="text-center mt-2 mb-2">Vue Vite Genesis</h1>
		<HelloWorld
			msg="A simple starter project for Vue 3, TypeScript, Tailwind CSS, and Vite."
		/>

		<!-- Lynx Integration -->
		<div class="mt-8 p-4 border rounded-lg shadow-md">
			<h2 class="text-xl font-bold mb-4">Lynx Integration Demo</h2>
			<p class="mb-4">
				This demonstrates integrating a Vue application with Lynx.
			</p>
			<lynx-view
				style="
					height: 500px;
					width: 100%;
					border: 1px solid #e2e8f0;
					border-radius: 4px;
				"
				url="/main.web.bundle"
			></lynx-view>
		</div>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
:root {
	--color-primary: #959595; /* Fallback primary color */
	--color-secondary: #6b7280; /* Fallback secondary color */
}
</style>
