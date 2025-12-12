<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { setupScrollAnimation } from '$lib/utils/animations';
	import { onMount } from 'svelte';

	let whoAmIText: HTMLElement;
	let whoAmIItem1: HTMLElement;
	let whoAmIItem2: HTMLElement;
	let whoAmIItem3: HTMLElement;

	onMount(() => {
		// Animation du texte
		setupScrollAnimation([
			{
				element: whoAmIText,
				initialClasses: ['fade-initial'],
				activeClasses: ['fade-in']
			}
		]);

		// Animation des items en séquence
		setupScrollAnimation([
			{
				element: whoAmIItem1,
				initialClasses: ['pop-initial'],
				activeClasses: ['pop-in'],
				delay: 300
			},
			{
				element: whoAmIItem2,
				initialClasses: ['pop-initial'],
				activeClasses: ['pop-in'],
				delay: 450
			},
			{
				element: whoAmIItem3,
				initialClasses: ['pop-initial'],
				activeClasses: ['pop-in'],
				delay: 600
			}
		]);
	});
</script>

<section class="py-24 relative">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<!-- Colonne de gauche - Texte -->
			<div bind:this={whoAmIText} class="space-y-6">
				<h2 class="text-4xl font-bold text-foreground">Qui je suis</h2>
				<p class="text-lg text-muted-foreground leading-relaxed">
					Après plusieurs années à faire évoluer le même produit web, j'ai appris à penser long
					terme : code maintenable, décisions techniques argumentées et respect des contraintes
					métier.
				</p>
				<p class="text-lg text-muted-foreground leading-relaxed">
					Mon terrain de jeu principal reste le front (Svelte, intégration, UX), mais avec une
					sensibilité produit et organisation qui me pousse naturellement vers la coordination et le
					support d'équipe.
				</p>
			</div>

			<!-- Colonne de droite - Illustration -->
			<div>
				<Card class="p-8 bg-linear-to-br from-primary/5 to-secondary/5 border-primary/10">
					<CardContent class="space-y-4">
						<div bind:this={whoAmIItem1} class="flex items-center space-x-4">
							<div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<svg
									class="w-6 h-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-semibold">Code Maintenable</h3>
								<p class="text-sm text-muted-foreground">Pensé pour durer</p>
							</div>
						</div>
						<div bind:this={whoAmIItem2} class="flex items-center space-x-4">
							<div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
								<svg
									class="w-6 h-6 text-secondary-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-semibold">Qualité</h3>
								<p class="text-sm text-muted-foreground">Exigence technique</p>
							</div>
						</div>
						<div bind:this={whoAmIItem3} class="flex items-center space-x-4">
							<div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
								<svg
									class="w-6 h-6 text-accent-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-semibold">Équipe</h3>
								<p class="text-sm text-muted-foreground">Collaboration active</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</section>
