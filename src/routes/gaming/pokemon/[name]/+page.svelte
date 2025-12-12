<script lang="ts">
	/** Page détail d’un Pokémon avec stats, types et chaîne d’évolution. */
	import Button from '$lib/components/ui/button/button.svelte';

	interface PokemonDetails {
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
			back_default: string;
			other: {
				'official-artwork': {
					front_default: string;
				};
			};
		};
		abilities: Array<{
			ability: {
				name: string;
				url: string;
			};
			is_hidden: boolean;
			slot: number;
		}>;
		moves: Array<{
			move: {
				name: string;
				url: string;
			};
			version_group_details: Array<{
				level_learned_at: number;
				move_learn_method: {
					name: string;
					url: string;
				};
				version_group: {
					name: string;
					url: string;
				};
			}>;
		}>;
	}

	interface TypeInfo {
		name: string;
		damage_relations: {
			double_damage_from: Array<{
				name: string;
			}>;
			double_damage_to: Array<{
				name: string;
			}>;
			half_damage_from: Array<{
				name: string;
			}>;
			half_damage_to: Array<{
				name: string;
			}>;
			no_damage_from: Array<{
				name: string;
			}>;
			no_damage_to: Array<{
				name: string;
			}>;
		};
	}

	interface PageData {
		pokemon: PokemonDetails;
		types: TypeInfo[];
	}

	let { data }: { data: PageData } = $props();

	let selectedSprite = $state('front');
	let showStats = $state(true);
	let showMoves = $state(false);
	let showWeaknesses = $state(false);

	// Calculate weaknesses and resistances
	let typeEffectiveness = $derived.by(() => {
		const effectiveness = {
			weaknesses: new Set<string>(),
			resistances: new Set<string>(),
			immunities: new Set<string>()
		};

		data.types.forEach((type) => {
			type.damage_relations.double_damage_from.forEach((dmg) => {
				effectiveness.weaknesses.add(dmg.name);
			});
			type.damage_relations.half_damage_from.forEach((dmg) => {
				effectiveness.resistances.add(dmg.name);
			});
			type.damage_relations.no_damage_from.forEach((dmg) => {
				effectiveness.immunities.add(dmg.name);
			});
		});

		return effectiveness;
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

	function getEffectivenessColor(effectiveness: 'weakness' | 'resistance' | 'immunity'): string {
		const colors = {
			weakness: 'bg-red-500',
			resistance: 'bg-green-500',
			immunity: 'bg-gray-500'
		};
		return colors[effectiveness];
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
			hp: 'PV',
			attack: 'Attaque',
			defense: 'Défense',
			'special-attack': 'Attaque Spé',
			'special-defense': 'Défense Spé',
			speed: 'Vitesse'
		};
		return names[statName] || statName;
	}

	function getStatColor(statName: string): string {
		const colors: Record<string, string> = {
			hp: 'bg-red-500',
			attack: 'bg-orange-500',
			defense: 'bg-blue-500',
			'special-attack': 'bg-purple-500',
			'special-defense': 'bg-green-500',
			speed: 'bg-yellow-500'
		};
		return colors[statName] || 'bg-gray-500';
	}

	function getStatWidth(baseStat: number): number {
		return Math.min((baseStat / 255) * 100, 100);
	}

	interface Move {
		move: {
			name: string;
			url: string;
		};
		version_group_details: Array<{
			level_learned_at: number;
			move_learn_method: {
				name: string;
				url: string;
			};
			version_group: {
				name: string;
				url: string;
			};
		}>;
	}

	interface LevelUpMove {
		name: string;
		level: number;
		url: string;
	}

	// Get moves learned by level up
	let levelUpMoves = $derived.by(() => {
		return data.pokemon.moves
			.filter((move: Move) =>
				move.version_group_details.some(
					(detail) =>
						detail.move_learn_method.name === 'level-up' && detail.version_group.name === 'red-blue'
				)
			)
			.map((move: Move) => {
				const levelUpDetail = move.version_group_details.find(
					(detail) =>
						detail.move_learn_method.name === 'level-up' && detail.version_group.name === 'red-blue'
				);
				return {
					name: move.move.name,
					level: levelUpDetail?.level_learned_at || 0,
					url: move.move.url
				};
			})
			.sort((a: LevelUpMove, b: LevelUpMove) => a.level - b.level)
			.slice(0, 10); // Show first 10 moves
	});
</script>

<svelte:head>
	<title
		>{data.pokemon.name.charAt(0).toUpperCase() + data.pokemon.name.slice(1)} - Pokémon Explorer</title
	>
	<meta
		name="description"
		content="Découvrez les statistiques, capacités et faiblesses de {data.pokemon.name}"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="text-center mb-8">
		<div class="text-sm text-muted-foreground mb-2">
			#{getPokemonId(data.pokemon.id)}
		</div>
		<h1 class="text-4xl font-bold mb-4 text-primary capitalize">
			{data.pokemon.name}
		</h1>

		<!-- Types -->
		<div class="flex justify-center gap-2 mb-4">
			{#each data.pokemon.types as typeInfo (typeInfo.type.name)}
				<span
					class="{getTypeColor(
						typeInfo.type.name
					)} text-white px-3 py-1 rounded-full text-sm capitalize"
				>
					{typeInfo.type.name}
				</span>
			{/each}
		</div>

		<!-- Navigation -->
		<Button
			onclick={() => (window.location.href = '/gaming/pokemon')}
			variant="outline"
			class="mb-6"
		>
			← Retour à l'explorateur
		</Button>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Left Column: Pokemon Image and Basic Info -->
		<div class="space-y-6">
			<!-- Pokemon Image -->
			<div class="bg-card border rounded-lg p-6">
				<div class="text-center mb-4">
					<div class="flex justify-center space-x-2 mb-4">
						<Button
							variant={selectedSprite === 'front' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (selectedSprite = 'front')}
						>
							Face
						</Button>
						<Button
							variant={selectedSprite === 'back' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (selectedSprite = 'back')}
						>
							Dos
						</Button>
					</div>

					<div class="relative h-48 bg-muted rounded-lg flex items-center justify-center">
						<img
							src={selectedSprite === 'front'
								? data.pokemon.sprites.other['official-artwork'].front_default
								: data.pokemon.sprites.back_default}
							alt={data.pokemon.name}
							class="w-32 h-32 object-contain"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = data.pokemon.sprites.front_default;
							}}
						/>
					</div>
				</div>

				<!-- Physical Stats -->
				<div class="bg-linear-to-r from-primary/20 to-secondary/20 p-4 text-center">
					<div class="bg-muted rounded-lg p-3">
						<div class="text-2xl font-bold text-primary">{formatHeight(data.pokemon.height)}</div>
						<div class="text-sm text-muted-foreground">Taille</div>
					</div>
					<div class="bg-muted rounded-lg p-3">
						<div class="text-2xl font-bold text-primary">{formatWeight(data.pokemon.weight)}</div>
						<div class="text-sm text-muted-foreground">Poids</div>
					</div>
				</div>
			</div>

			<!-- Abilities -->
			<div class="bg-card border rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4 text-foreground">Capacités</h2>
				<div class="space-y-2">
					{#each data.pokemon.abilities as ability (ability.ability.name)}
						<div class="flex items-center justify-between p-2 bg-muted rounded">
							<span class="capitalize font-medium">{ability.ability.name.replace('-', ' ')}</span>
							{#if ability.is_hidden}
								<span class="text-xs bg-purple-500 text-white px-2 py-1 rounded">Cachée</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right Column: Stats, Moves, Weaknesses -->
		<div class="space-y-6">
			<!-- Tab Navigation -->
			<div class="bg-card border rounded-lg p-2">
				<div class="flex space-x-2">
					<Button
						variant={showStats ? 'default' : 'ghost'}
						class="flex-1"
						onclick={() => {
							showStats = true;
							showMoves = false;
							showWeaknesses = false;
						}}
					>
						Statistiques
					</Button>
					<Button
						variant={showMoves ? 'default' : 'ghost'}
						class="flex-1"
						onclick={() => {
							showStats = false;
							showMoves = true;
							showWeaknesses = false;
						}}
					>
						Capacités
					</Button>
					<Button
						variant={showWeaknesses ? 'default' : 'ghost'}
						class="flex-1"
						onclick={() => {
							showStats = false;
							showMoves = false;
							showWeaknesses = true;
						}}
					>
						Faiblesses
					</Button>
				</div>
			</div>

			<!-- Stats Tab -->
			{#if showStats}
				<div class="bg-card border rounded-lg p-6">
					<h2 class="text-xl font-semibold mb-4 text-foreground">Statistiques de combat</h2>
					<div class="space-y-3">
						{#each data.pokemon.stats as stat (stat.stat.name)}
							<div class="space-y-1">
								<div class="flex justify-between text-sm">
									<span class="font-medium">{getStatName(stat.stat.name)}</span>
									<span class="font-bold">{stat.base_stat}</span>
								</div>
								<div class="w-full bg-muted rounded-full h-2">
									<div
										class="{getStatColor(
											stat.stat.name
										)} h-2 rounded-full transition-all duration-500"
										style="width: {getStatWidth(stat.base_stat)}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Moves Tab -->
			{#if showMoves}
				<div class="bg-card border rounded-lg p-6">
					<h2 class="text-xl font-semibold mb-4 text-foreground">Capacités (Niv. 1-100)</h2>
					<div class="space-y-2">
						{#each levelUpMoves as move (move.name)}
							<div class="flex items-center justify-between p-2 bg-muted rounded">
								<span class="capitalize font-medium">{move.name.replace('-', ' ')}</span>
								<span class="text-sm text-muted-foreground">Niv. {move.level}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Weaknesses Tab -->
			{#if showWeaknesses}
				<div class="bg-card border rounded-lg p-6">
					<h2 class="text-xl font-semibold mb-4 text-foreground">Efficacité des types</h2>

					{#if typeEffectiveness.immunities.size > 0}
						<div class="mb-4">
							<h3 class="font-medium text-foreground mb-2">Immunités</h3>
							<div class="flex flex-wrap gap-2">
								{#each Array.from(typeEffectiveness.immunities) as immunity (immunity)}
									<span
										class="{getEffectivenessColor(
											'immunity'
										)} text-white px-2 py-1 rounded text-sm capitalize"
									>
										{immunity}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if typeEffectiveness.resistances.size > 0}
						<div class="mb-4">
							<h3 class="font-medium text-foreground mb-2">Résistances</h3>
							<div class="flex flex-wrap gap-2">
								{#each Array.from(typeEffectiveness.resistances) as resistance (resistance)}
									<span
										class="{getEffectivenessColor(
											'resistance'
										)} text-white px-2 py-1 rounded text-sm capitalize"
									>
										{resistance}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if typeEffectiveness.weaknesses.size > 0}
						<div>
							<h3 class="font-medium text-foreground mb-2">Faiblesses</h3>
							<div class="flex flex-wrap gap-2">
								{#each Array.from(typeEffectiveness.weaknesses) as weakness (weakness)}
									<span
										class="{getEffectivenessColor(
											'weakness'
										)} text-white px-2 py-1 rounded text-sm capitalize"
									>
										{weakness}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
