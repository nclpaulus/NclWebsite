<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
	<div class="container mx-auto px-4 relative z-20">
		<div class="text-center max-w-4xl mx-auto">
			<h1 class="text-5xl md:text-7xl font-bold text-foreground mb-6">Nicolas Paulus</h1>
			<p class="text-xl md:text-2xl text-muted-foreground mb-8">
				Développeur Front-End & Craftsmanship enthusiast
			</p>
			<div class="flex flex-wrap gap-3 justify-center mb-12">
				<Badge variant="default" class="text-sm px-4 py-2">Svelte</Badge>
				<Badge variant="secondary" class="text-sm px-4 py-2">TypeScript</Badge>
				<Badge variant="outline" class="text-sm px-4 py-2">Tailwind CSS</Badge>
				<Badge variant="outline" class="text-sm px-4 py-2">UX/UI</Badge>
			</div>
			<div class="flex gap-4 justify-center">
				<Button href="/contact" class="px-8 py-3">Me contacter</Button>
				<Button variant="outline" href="/projects" class="px-8 py-3">Voir mes projets</Button>
			</div>
		</div>
	</div>

	<!-- Indicateur de scroll -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
		<div class="animate-bounce">
			<svg
				class="w-6 h-6 text-muted-foreground"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				></path>
			</svg>
		</div>
	</div>
</section>
