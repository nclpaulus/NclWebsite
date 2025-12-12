<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Game {
		id: number;
		title: string;
		thumbnail: string;
		short_description: string;
		game_url: string;
		genre: string;
		platform: string;
		publisher: string;
		developer: string;
		release_date: string;
		freetogame_profile_url: string;
	}

	interface PageData {
		games: Game[];
		genres: string[];
		platforms: string[];
	}

	let { data }: { data: PageData } = $props();

	let selectedGenre = $state('all');
	let selectedPlatform = $state('all');
	let searchQuery = $state('');
	let isLoading = $state(false);

	// Create derived reactive value for filtered games
	let filteredGames = $derived.by(() => {
		let games = [...data.games];

		// Filter by genre
		if (selectedGenre !== 'all') {
			games = games.filter((game) => game.genre.toLowerCase() === selectedGenre.toLowerCase());
		}

		// Filter by platform
		if (selectedPlatform !== 'all') {
			games = games.filter(
				(game) => game.platform.toLowerCase() === selectedPlatform.toLowerCase()
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			games = games.filter(
				(game) =>
					game.title.toLowerCase().includes(query) ||
					game.genre.toLowerCase().includes(query) ||
					game.short_description.toLowerCase().includes(query)
			);
		}

		return games;
	});

	async function refreshGames() {
		isLoading = true;
		try {
			// Use SvelteKit's built-in navigation to refresh page data
			await goto('.', { invalidateAll: true });
		} catch (error) {
			console.error('Failed to refresh games:', error);
		} finally {
			isLoading = false;
		}
	}

	function getPlatformIcon(platform: string): string {
		switch (platform.toLowerCase()) {
			case 'pc':
				return '🖥️';
			case 'web':
				return '🌐';
			default:
				return '🎮';
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Découverte Gaming - NPaulusWebsite</title>
	<meta
		name="description"
		content="Découvrez 15 jeux gratuits au hasard parmi une sélection de milliers de jeux"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-4 text-primary">Découverte Gaming</h1>
		<p class="text-lg text-muted-foreground mb-6">
			Explorez 15 jeux gratuits sélectionnés au hasard. Filtrez par genre, plateforme ou recherchez
			votre prochain jeu préféré !
		</p>
		<Button onclick={refreshGames} disabled={isLoading} class="mb-6">
			{#if isLoading}
				<div class="flex items-center space-x-2">
					<div
						class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
					></div>
					<span>Chargement...</span>
				</div>
			{:else}
				<div class="flex items-center space-x-2">
					<span>🎲</span>
					<span>Nouveaux jeux aléatoires</span>
				</div>
			{/if}
		</Button>
	</div>

	<!-- Filters -->
	<div class="bg-card border rounded-lg p-6 mb-8">
		<h2 class="text-xl font-semibold mb-4 text-foreground">Filtres</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<!-- Search -->
			<div>
				<label for="search" class="block text-sm font-medium text-foreground mb-2">
					Recherche
				</label>
				<input
					id="search"
					type="text"
					placeholder="Rechercher un jeu..."
					bind:value={searchQuery}
					class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

			<!-- Genre Filter -->
			<div>
				<label for="genre" class="block text-sm font-medium text-foreground mb-2"> Genre </label>
				<select
					id="genre"
					bind:value={selectedGenre}
					class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				>
					<option value="all">Tous les genres</option>
					{#each data.genres as genre (genre)}
						<option value={genre}>{genre}</option>
					{/each}
				</select>
			</div>

			<!-- Platform Filter -->
			<div>
				<label for="platform" class="block text-sm font-medium text-foreground mb-2">
					Plateforme
				</label>
				<select
					id="platform"
					bind:value={selectedPlatform}
					class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				>
					<option value="all">Toutes les plateformes</option>
					{#each data.platforms as platform (platform)}
						<option value={platform}>{platform}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Results count -->
		<div class="mt-4 text-sm text-muted-foreground">
			{filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !==
			1
				? 's'
				: ''}
		</div>
	</div>

	<!-- Games Grid -->
	{#if filteredGames.length === 0}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">🎮</div>
			<h3 class="text-xl font-semibold text-foreground mb-2">Aucun jeu trouvé</h3>
			<p class="text-muted-foreground">
				Essayez de modifier vos filtres ou de faire une nouvelle recherche aléatoire.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredGames as game (game.id)}
				<div
					class="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
				>
					<!-- Game Thumbnail -->
					<div class="relative h-48 bg-muted overflow-hidden">
						<img
							src={game.thumbnail}
							alt={game.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src =
									'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2Ugbm9uIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
							}}
						/>

						<!-- Platform Badge -->
						<div
							class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1"
						>
							<span>{getPlatformIcon(game.platform)}</span>
							<span>{game.platform}</span>
						</div>

						<!-- Genre Badge -->
						<div
							class="absolute top-2 left-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs"
						>
							{game.genre}
						</div>
					</div>

					<!-- Game Info -->
					<div class="p-4">
						<h3 class="font-semibold text-lg text-foreground mb-2 line-clamp-1">
							{game.title}
						</h3>

						<p class="text-sm text-muted-foreground mb-3 line-clamp-2">
							{game.short_description}
						</p>

						<div class="flex items-center justify-between text-xs text-muted-foreground mb-4">
							<span>📅 {formatDate(game.release_date)}</span>
							<span>🏢 {game.developer}</span>
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-2">
							<a
								href={game.game_url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors text-center"
							>
								Jouer
							</a>
							<a
								href={game.freetogame_profile_url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors text-center"
							>
								Plus d'infos
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 1;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style>
