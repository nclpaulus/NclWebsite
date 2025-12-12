<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { setupScrollAnimation } from '$lib/utils/animations';
	import { onMount } from 'svelte';

	let card1: HTMLElement;
	let card2: HTMLElement;
	let card3: HTMLElement;
	let ctaSection: HTMLElement;

	onMount(() => {
		// Animation flip-in pour les 3 cartes
		setupScrollAnimation([
			{
				element: card1,
				initialClasses: ['flip-initial'],
				activeClasses: ['flip-in'],
				delay: 0
			},
			{
				element: card2,
				initialClasses: ['flip-initial'],
				activeClasses: ['flip-in'],
				delay: 200
			},
			{
				element: card3,
				initialClasses: ['flip-initial'],
				activeClasses: ['flip-in'],
				delay: 400
			}
		]);

		// Animation scale-up avec blur pour le CTA
		setupScrollAnimation([
			{
				element: ctaSection,
				initialClasses: ['cta-initial'],
				activeClasses: ['cta-in'],
				delay: 500
			}
		]);
	});
</script>

<section class="py-24 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto text-center space-y-8">
			<h2 class="text-4xl font-bold text-foreground">Ce site et ma façon de travailler</h2>
			<p class="text-lg text-muted-foreground leading-relaxed">
				Ce site me sert de terrain d'expérimentation et de démonstration
			</p>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
				<div bind:this={card1}>
					<Card class="p-6 h-full hover:shadow-lg transition-shadow">
						<CardContent class="space-y-4">
							<div
								class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
							>
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
										d="M13 10V3L4 14h7v7l9-11h-7z"
									></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-2">Performance</h3>
							<p class="text-sm text-muted-foreground">
								Optimisé pour être rapide et léger, avec un score Google Pagespeed de 95+
							</p>
						</CardContent>
					</Card>
				</div>

				<div bind:this={card2}>
					<Card class="p-6 h-full hover:shadow-lg transition-shadow">
						<CardContent class="space-y-4">
							<div
								class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-6 h-6 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-2">Code Maintenable</h3>
							<p class="text-sm text-muted-foreground">
								Architecture claire, TypeScript partout, et un souci constant de la qualité
							</p>
						</CardContent>
					</Card>
				</div>

				<div bind:this={card3}>
					<Card class="p-6 h-full hover:shadow-lg transition-shadow">
						<CardContent class="space-y-4">
							<div
								class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4"
							>
								<svg
									class="w-6 h-6 text-accent"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									></path>
								</svg>
							</div>
							<h3 class="font-semibold mb-2">Apprentissage continu</h3>
							<p class="text-sm text-muted-foreground">
								Exploration de nouvelles technos et patterns pour rester à la pointe
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<div bind:this={ctaSection} class="mt-16">
				<Card class="p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-primary/10">
					<CardContent class="text-center space-y-6">
						<h3 class="text-2xl font-semibold">Envie d'en savoir plus ?</h3>
						<p class="text-muted-foreground max-w-2xl mx-auto">
							Je suis toujours ouvert à discuter de nouveaux projets, d'idées créatives ou de
							possibilités de collaboration.
						</p>
						<div class="flex gap-4 justify-center pt-4">
							<Button href="/contact" class="px-8 py-3">Démarrons la conversation</Button>
							<Button variant="outline" href="/projects" class="px-8 py-3"
								>Explorer mes réalisations</Button
							>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</section>
