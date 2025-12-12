<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { setupScrollAnimation } from '$lib/utils/animations';
	import { onMount } from 'svelte';

	let visionCard: HTMLElement;
	let visionText: HTMLElement;

	onMount(() => {
		// Animation de la section Vision
		setupScrollAnimation([
			{
				element: visionCard,
				initialClasses: ['slide-in-left'],
				activeClasses: ['slide-in-left', 'slide-in-active']
			},
			{
				element: visionText,
				initialClasses: ['slide-in-right'],
				activeClasses: ['slide-in-right', 'slide-in-active'],
				delay: 200
			}
		]);
	});
</script>

<section class="py-24">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<!-- Colonne de gauche - Visuel -->
			<div bind:this={visionCard}>
				<div class="relative">
					<div
						class="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 rounded-lg transform rotate-3"
					></div>
					<Card class="relative p-8 bg-background/80 backdrop-blur">
						<CardContent class="space-y-6">
							<div class="flex items-center space-x-3">
								<Badge variant="default">Craftsmanship</Badge>
								<Badge variant="secondary">Team Work</Badge>
							</div>
							<ul class="space-y-3">
								<li class="flex items-start space-x-3">
									<svg
										class="w-5 h-5 text-primary mt-0.5 shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-muted-foreground">Code lisible, testé et documenté</span>
								</li>
								<li class="flex items-start space-x-3">
									<svg
										class="w-5 h-5 text-primary mt-0.5 shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-muted-foreground">Petites itérations, feedback régulier</span>
								</li>
								<li class="flex items-start space-x-3">
									<svg
										class="w-5 h-5 text-primary mt-0.5 shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-muted-foreground">Réduction de la dette technique</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Colonne de droite - Texte -->
			<div bind:this={visionText} class="space-y-6">
				<h2 class="text-4xl font-bold text-foreground">Vision long terme</h2>
				<p class="text-lg text-muted-foreground leading-relaxed">
					Je vois le rôle de dev front comme un mix entre craftsmanship et travail d'équipe.
				</p>
				<p class="text-lg text-muted-foreground leading-relaxed">
					À moyen terme, l'objectif est de prendre plus de responsabilités sur la structuration du
					front (choix techniques, guidelines, revues) et l'animation de la team (accompagnement,
					partage de bonnes pratiques, cadrage des features).
				</p>
			</div>
		</div>
	</div>
</section>
