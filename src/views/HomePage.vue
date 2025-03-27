<template>
	<div class="home-page">
		<header>
			<h1>Vue Lynx Genesis</h1>
			<p class="subtitle">A Vue 3 + TypeScript + Lynx Framework Project</p>
		</header>

		<main>
			<section class="hero">
				<h2>Welcome to Vue Lynx Genesis</h2>
				<p>
					This project demonstrates the integration of Vue 3 with the Lynx framework. It provides a
					foundation for building cross-platform applications that work on both web and mobile
					platforms.
				</p>
			</section>

			<section class="features">
				<h2>Features</h2>
				<div class="feature-grid">
					<div class="feature-card">
						<h3>Vue 3 + TypeScript</h3>
						<p>Leverage the power of Vue 3's Composition API with TypeScript support.</p>
					</div>

					<div class="feature-card">
						<h3>Lynx Framework</h3>
						<p>Build cross-platform UIs that work seamlessly on web and mobile.</p>
					</div>

					<div class="feature-card">
						<h3>Vite Powered</h3>
						<p>Ultra-fast development with Vite's near-instantaneous hot module replacement.</p>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'HomePage',
	setup() {
		console.log('HomePage component setup');

		return {};
	},
});
</script>

<style scoped>
.home-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

header {
	text-align: center;
	margin-bottom: 3rem;
}

h1 {
	font-size: 2.5rem;
	color: #41b883;
	margin-bottom: 0.5rem;
}

.subtitle {
	color: #6e7781;
	font-size: 1.2rem;
}

.hero {
	background-color: #f8f9fa;
	padding: 2rem;
	border-radius: 8px;
	margin-bottom: 2rem;
}

.hero h2 {
	color: #2c3e50;
	margin-bottom: 1rem;
}

.hero p {
	line-height: 1.6;
}

.features h2 {
	margin-bottom: 1.5rem;
	text-align: center;
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1.5rem;
}

.feature-card {
	background-color: white;
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	border: 1px solid #eaeaea;
}

.feature-card h3 {
	color: #41b883;
	margin-bottom: 0.5rem;
}

.feature-card p {
	color: #6e7781;
	line-height: 1.5;
}
</style>
