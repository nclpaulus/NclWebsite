<script lang="ts">
	/** Page d’accueil gaming avec liens vers Pokémon et découverte de jeux. */
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<svelte:head>
	<title>Gaming - WeCraft</title>
	<meta
		name="description"
		content="Ma passion pour le gaming et mes expériences dans l'univers du jeu vidéo"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-6 text-primary">Gaming</h1>
	<p class="text-lg text-muted-foreground mb-8">
		Découvrez ma passion pour le gaming, mes jeux préférés et mes expériences dans l'univers du jeu
		vidéo.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-foreground">Jeux du Moment</h2>

			<div
				class="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors"
			>
				<div
					class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold"
				>
					G1
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-foreground">Jeu RPG</h3>
					<p class="text-sm text-muted-foreground">Aventure épique dans un monde fantastique</p>
				</div>
			</div>

			<div
				class="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors"
			>
				<div
					class="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-bold"
				>
					G2
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-foreground">Jeu Stratégie</h3>
					<p class="text-sm text-muted-foreground">Tactique et réflexion dans chaque partie</p>
				</div>
			</div>

			<div
				class="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors"
			>
				<div
					class="w-16 h-16 bg-destructive rounded-lg flex items-center justify-center text-destructive-foreground font-bold"
				>
					G3
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-foreground">Jeu Action</h3>
					<p class="text-sm text-muted-foreground">Adrénaline et combats intenses</p>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-foreground">Stats Gaming</h2>

			<div class="grid grid-cols-2 gap-4">
				<div class="bg-card border rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-primary">150+</div>
					<div class="text-sm text-muted-foreground">Jeux joués</div>
				</div>
				<div class="bg-card border rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-primary">2000h</div>
					<div class="text-sm text-muted-foreground">Temps de jeu</div>
				</div>
				<div class="bg-card border rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-primary">25</div>
					<div class="text-sm text-muted-foreground">Achievements</div>
				</div>
				<div class="bg-card border rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-primary">12</div>
					<div class="text-sm text-muted-foreground">Genres préférés</div>
				</div>
			</div>

			<div class="bg-muted rounded-lg p-6">
				<h3 class="font-semibold text-foreground mb-3">Plateformes</h3>
				<div class="flex flex-wrap gap-2">
					<span class="px-3 py-1 bg-background border rounded-full text-sm">PC</span>
					<span class="px-3 py-1 bg-background border rounded-full text-sm">PlayStation</span>
					<span class="px-3 py-1 bg-background border rounded-full text-sm">Nintendo Switch</span>
					<span class="px-3 py-1 bg-background border rounded-full text-sm">Xbox</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Discovery Section -->
	<div class="mt-12 bg-card border rounded-lg p-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold mb-4 text-primary">🎲 Découverte de Jeux</h2>
			<p class="text-lg text-muted-foreground mb-6">
				Explorez notre sélection de 15 jeux gratuits choisis au hasard parmi des milliers de titres.
				Filtrez par genre, plateforme ou trouvez votre prochaine perle rare !
			</p>
			<Button
				onclick={() => (window.location.href = '/gaming/discovery')}
				class="text-lg px-6 py-3"
			>
				<div class="flex items-center space-x-2">
					<span>🎮</span>
					<span>Découvrir des jeux</span>
					<span>→</span>
				</div>
			</Button>
		</div>
	</div>

	<!-- Pokémon Section -->
	<div class="mt-8 bg-card border rounded-lg p-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold mb-4 text-primary">🎮 Pokémon Explorer</h2>
			<p class="text-lg text-muted-foreground mb-6">
				Explorez l'univers des 151 Pokémon de la première génération. Filtrez par type, taille,
				poids et découvrez leurs statistiques détaillées !
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					onclick={() => (window.location.href = '/gaming/pokemon')}
					class="text-lg px-6 py-3"
				>
					<div class="flex items-center space-x-2">
						<span>🔍</span>
						<span>Explorer les Pokémon</span>
						<span>→</span>
					</div>
				</Button>
				<Button
					onclick={() => (window.location.href = '/gaming/pokemon/pikachu')}
					variant="outline"
					class="text-lg px-6 py-3"
				>
					<div class="flex items-center space-x-2">
						<span>⚡</span>
						<span>Voir Pikachu</span>
						<span>→</span>
					</div>
				</Button>
			</div>
		</div>
	</div>
</div>
