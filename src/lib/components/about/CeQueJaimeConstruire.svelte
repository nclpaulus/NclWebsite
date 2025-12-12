<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { setupStaggeredAnimation } from '$lib/utils/animations';
	import { onMount } from 'svelte';

	let card1: HTMLElement;
	let card2: HTMLElement;
	let card3: HTMLElement;

	onMount(() => {
		// Animation en cascade pour les 3 cartes
		setupStaggeredAnimation([card1, card2, card3], 150, {
			threshold: 0.1,
			initialClasses: ['card-initial'],
			activeClasses: ['animate-in']
		});
	});
</script>

<section class="py-24 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-foreground mb-4">Ce que j'aime construire</h2>
			<p class="text-lg text-muted-foreground">Mes domaines de prédilection</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Dashboard SaaS -->
			<div bind:this={card1}>
				<Card class="h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
					<CardContent class="space-y-4">
						<div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
							<svg
								class="w-8 h-8 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold mb-2">Dashboards "SaaS-like"</h3>
						<p class="text-muted-foreground">
							Lisibles, avec une UX pensée pour les vrais utilisateurs, pas uniquement pour les
							dribbleshots.
						</p>
					</CardContent>
				</Card>
			</div>

			<!-- Outils front -->
			<div bind:this={card2}>
				<Card class="h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
					<CardContent class="space-y-4">
						<div class="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-4">
							<svg
								class="w-8 h-8 text-secondary-foreground"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold mb-2">Outils front concrets</h3>
						<p class="text-muted-foreground">
							Multilingue, gestion de contenu, automatisation simple, intégrations API.
						</p>
					</CardContent>
				</Card>
			</div>

			<!-- Expériences gaming -->
			<div bind:this={card3}>
				<Card class="h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
					<CardContent class="space-y-4">
						<div class="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
							<svg
								class="w-8 h-8 text-accent-foreground"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
								/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold mb-2">Expériences gaming</h3>
						<p class="text-muted-foreground">
							Builders, visualisations, mini-apps interactives pour garder un pied dans le côté fun
							du web.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</section>
