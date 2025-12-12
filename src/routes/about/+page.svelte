<script lang="ts">
	import GridBackground from '$lib/components/GridBackground.svelte';
	import Hero from '$lib/components/about/Hero.svelte';
	import QuiJeSuis from '$lib/components/about/QuiJeSuis.svelte';
	import VisionLongTerme from '$lib/components/about/VisionLongTerme.svelte';
	import CeQueJaimeConstruire from '$lib/components/about/CeQueJaimeConstruire.svelte';
	import CeSite from '$lib/components/about/CeSite.svelte';
	import Personnel from '$lib/components/about/Personnel.svelte';
	import '$lib/styles/animations.css';
</script>

<svelte:head>
	<title>À propos - WeCraft</title>
	<meta
		name="description"
		content="Développeur front-end passionné par les interfaces claires, rapides et utiles"
	/>
</svelte:head>

<div class="min-h-screen bg-background relative">
	<!-- Fond animé avec grille -->
	<GridBackground />

	<!-- Sections importées -->
	<Hero />
	<QuiJeSuis />
	<CeQueJaimeConstruire />
	<VisionLongTerme />
	<CeSite />
	<Personnel />
</div>
