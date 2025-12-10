<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Portfolio - NPaulusWebsite</title>
	<meta name="description" content="Découvrez mes projets et réalisations professionnelles" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-6 text-primary">Portfolio</h1>
	<p class="text-lg text-muted-foreground mb-8">
		Bienvenue dans mon portfolio. Découvrez mes projets, compétences et réalisations.
	</p>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<div class="card border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<h3 class="text-xl font-semibold mb-3 text-foreground">Projet 1</h3>
			<p class="text-muted-foreground mb-4">
				Description du premier projet avec les technologies utilisées.
			</p>
			<div class="flex gap-2">
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">SvelteKit</span>
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">TypeScript</span>
			</div>
		</div>
		
		<div class="card border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<h3 class="text-xl font-semibold mb-3 text-foreground">Projet 2</h3>
			<p class="text-muted-foreground mb-4">
				Description du deuxième projet avec les technologies utilisées.
			</p>
			<div class="flex gap-2">
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">Tailwind CSS</span>
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">Node.js</span>
			</div>
		</div>
		
		<div class="card border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<h3 class="text-xl font-semibold mb-3 text-foreground">Projet 3</h3>
			<p class="text-muted-foreground mb-4">
				Description du troisième projet avec les technologies utilisées.
			</p>
			<div class="flex gap-2">
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">React</span>
				<span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">PostgreSQL</span>
			</div>
		</div>
	</div>
</div>
