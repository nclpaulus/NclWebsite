<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';

	interface Pokemon {
		id: number;
		name: string;
		height: number;
		weight: number;
		types: Array<{
			type: {
				name: string;
				url: string;
			};
			slot: number;
		}>;
		stats: Array<{
			base_stat: number;
			effort: number;
			stat: {
				name: string;
				url: string;
			};
		}>;
		sprites: {
			front_default: string;
			other: {
				'official-artwork': {
					front_default: string;
				};
			};
		};
	}

	interface Type {
		name: string;
		url: string;
	}

	interface PageData {
		pokemon: Pokemon[];
		types: Type[];
		totalCount: number;
	}

	let { data }: { data: PageData } = $props();

	let selectedType = $state('all');
	let minHeight = $state(0);
	let maxHeight = $state(200);
	let minWeight = $state(0);
	let maxWeight = $state(1000);
	let searchQuery = $state('');

	// Create derived reactive value for filtered Pokémon
	let filteredPokemon = $derived.by(() => {
		let filtered = [...data.pokemon];

		// Filter by type
		if (selectedType !== 'all') {
			filtered = filtered.filter(pokemon =>
				pokemon.types.some(typeInfo => typeInfo.type.name === selectedType)
			);
		}

		// Filter by height
		filtered = filtered.filter(pokemon =>
			pokemon.height >= minHeight && pokemon.height <= maxHeight
		);

		// Filter by weight
		filtered = filtered.filter(pokemon =>
			pokemon.weight >= minWeight && pokemon.weight <= maxWeight
		);

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(pokemon =>
				pokemon.name.toLowerCase().includes(query)
			);
		}

		return filtered.sort((a, b) => a.id - b.id);
	});

	function getTypeColor(type: string): string {
		const colors: Record<string, string> = {
			normal: 'bg-gray-400',
			fire: 'bg-red-500',
			water: 'bg-blue-500',
			electric: 'bg-yellow-400',
			grass: 'bg-green-500',
			ice: 'bg-cyan-400',
			fighting: 'bg-orange-600',
			poison: 'bg-purple-500',
			ground: 'bg-yellow-600',
			flying: 'bg-indigo-400',
			psychic: 'bg-pink-500',
			bug: 'bg-lime-500',
			rock: 'bg-yellow-800',
			ghost: 'bg-purple-700',
			dragon: 'bg-indigo-600',
			dark: 'bg-gray-800',
			steel: 'bg-gray-600',
			fairy: 'bg-pink-300'
		};
		return colors[type] || 'bg-gray-400';
	}

	function formatHeight(height: number): string {
		return `${(height / 10).toFixed(1)} m`;
	}

	function formatWeight(weight: number): string {
		return `${(weight / 10).toFixed(1)} kg`;
	}

	function getPokemonId(id: number): string {
		return id.toString().padStart(3, '0');
	}

	function getStatName(statName: string): string {
		const names: Record<string, string> = {
			'hp': 'PV',
			'attack': 'Attaque',
			'defense': 'Défense',
			'special-attack': 'Attaque Spé',
			'special-defense': 'Défense Spé',
			'speed': 'Vitesse'
		};
		return names[statName] || statName;
	}
</script>

<svelte:head>
	<title>Pokémon Explorer - NPaulusWebsite</title>
	<meta
		name="description"
		content="Explorez l'univers Pokémon avec filtres avancés par type, taille et poids"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-4 text-primary">🎮 Pokémon Explorer</h1>
		<p class="text-lg text-muted-foreground mb-6">
			Découvrez les 151 Pokémon de la première génération avec des filtres avancés.
			Explorez leurs statistiques, types et caractéristiques !
		</p>
	</div>

	<!-- Filters -->
	<div class="bg-card border rounded-lg p-6 mb-8">
		<h2 class="text-xl font-semibold mb-4 text-foreground">Filtres</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
			<!-- Search -->
			<div>
				<label for="search" class="block text-sm font-medium text-foreground mb-2">
					Recherche
				</label>
				<input
					id="search"
					type="text"
					placeholder="Rechercher un Pokémon..."
					bind:value={searchQuery}
					class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div>

			<!-- Type Filter -->
			<div>
				<label for="type" class="block text-sm font-medium text-foreground mb-2">
					Type
				</label>
				<select
					id="type"
					bind:value={selectedType}
					class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				>
					<option value="all">Tous les types</option>
					{#each data.types as type}
						<option value={type.name}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</option>
					{/each}
				</select>
			</div>

			<!-- Height Range -->
			<div>
				<label for="height-range" class="block text-sm font-medium text-foreground mb-2">
					Taille: {formatHeight(minHeight)} - {formatHeight(maxHeight)}
				</label>
				<div class="flex items-center space-x-2">
					<input
						id="height-min"
						type="range"
						min="0"
						max="200"
						bind:value={minHeight}
						class="flex-1"
						aria-label="Taille minimum"
					/>
					<input
						id="height-max"
						type="range"
						min="0"
						max="200"
						bind:value={maxHeight}
						class="flex-1"
						aria-label="Taille maximum"
					/>
				</div>
			</div>

			<!-- Weight Range -->
			<div>
				<label for="weight-range" class="block text-sm font-medium text-foreground mb-2">
					Poids: {formatWeight(minWeight)} - {formatWeight(maxWeight)}
				</label>
				<div class="flex items-center space-x-2">
					<input
						id="weight-min"
						type="range"
						min="0"
						max="1000"
						bind:value={minWeight}
						class="flex-1"
						aria-label="Poids minimum"
					/>
					<input
						id="weight-max"
						type="range"
						min="0"
						max="1000"
						bind:value={maxWeight}
						class="flex-1"
						aria-label="Poids maximum"
					/>
				</div>
			</div>
		</div>

		<!-- Results count -->
		<div class="text-sm text-muted-foreground">
			{filteredPokemon.length} Pokémon trouvé{filteredPokemon.length !== 1 ? 's' : ''} sur {data.pokemon.length}
		</div>
	</div>

	<!-- Pokemon Grid -->
	{#if filteredPokemon.length === 0}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">🔍</div>
			<h3 class="text-xl font-semibold text-foreground mb-2">Aucun Pokémon trouvé</h3>
			<p class="text-muted-foreground">
				Essayez de modifier vos filtres pour trouver des Pokémon.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredPokemon as pokemon (pokemon.id)}
				<div class="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
					<!-- Pokemon Header -->
					<div class="bg-linear-to-r from-primary/20 to-secondary/20 p-4 text-center">
						<div class="text-sm text-muted-foreground mb-1">
							#{getPokemonId(pokemon.id)}
						</div>
						<h3 class="text-lg font-bold text-foreground capitalize mb-2">
							{pokemon.name}
						</h3>
						
						<!-- Types -->
						<div class="flex justify-center gap-2 mb-3">
							{#each pokemon.types as typeInfo}
								<span class="{getTypeColor(typeInfo.type.name)} text-white text-xs px-2 py-1 rounded-full capitalize">
									{typeInfo.type.name}
								</span>
							{/each}
						</div>
					</div>

					<!-- Pokemon Image -->
					<div class="relative h-32 bg-muted flex items-center justify-center">
						<img
							src={pokemon.sprites.other['official-artwork'].front_default}
							alt={pokemon.name}
							class="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = pokemon.sprites.front_default;
							}}
						/>
					</div>

					<!-- Pokemon Info -->
					<div class="p-4">
						<!-- Physical Stats -->
						<div class="grid grid-cols-2 gap-2 mb-3 text-sm">
							<div class="flex items-center space-x-1">
								<span class="text-muted-foreground">📏</span>
								<span class="text-foreground">{formatHeight(pokemon.height)}</span>
							</div>
							<div class="flex items-center space-x-1">
								<span class="text-muted-foreground">⚖️</span>
								<span class="text-foreground">{formatWeight(pokemon.weight)}</span>
							</div>
						</div>

						<!-- Battle Stats Preview -->
						<div class="space-y-1">
							<div class="flex justify-between text-xs">
								<span class="text-muted-foreground">PV</span>
								<span class="text-foreground font-medium">{pokemon.stats[0].base_stat}</span>
							</div>
							<div class="flex justify-between text-xs">
								<span class="text-muted-foreground">Attaque</span>
								<span class="text-foreground font-medium">{pokemon.stats[1].base_stat}</span>
							</div>
							<div class="flex justify-between text-xs">
								<span class="text-muted-foreground">Défense</span>
								<span class="text-foreground font-medium">{pokemon.stats[2].base_stat}</span>
							</div>
						</div>

						<!-- View Details Button -->
						<Button variant="outline" size="sm" class="w-full mt-3">
							<a href="/gaming/pokemon/{pokemon.name}" class="flex items-center justify-center space-x-1">
								<span>Voir détails</span>
								<span>→</span>
							</a>
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
