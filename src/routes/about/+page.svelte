<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import GridBackground from '$lib/components/GridBackground.svelte';
</script>

<svelte:head>
	<title>À propos - WeCraft</title>
	<meta
		name="description"
		content="Développeur front-end passionné par les interfaces claires, rapides et utiles"
	/>
</svelte:head>

<div class="min-h-screen bg-background relative">
	<GridBackground />
	<!-- Hero Section -->
	<section class="relative h-screen flex items-center justify-center overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0">
			<div
				class="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5"
			></div>
			<div class="absolute inset-0 bg-grid-white/[0.02] bg-size-[50px_50px]"></div>
		</div>

		<!-- Contenu principal -->
		<div class="relative z-10 container mx-auto px-4">
			<div class="max-w-4xl mx-auto text-center">
				<h1
					class="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"
				>
					À propos
				</h1>
				<p class="text-xl md:text-2xl text-muted-foreground leading-relaxed">
					Développeur front‑end passionné par les interfaces claires, rapides et utiles, spécialisé
					aujourd'hui sur SvelteKit et les expériences web interactives, avec un vrai intérêt pour
					la qualité du code, le travail en équipe et la gestion de projet.
				</p>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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
				/>
			</svg>
		</div>
	</section>

	<!-- Section Qui je suis -->
	<section class="py-24 relative">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<!-- Colonne de gauche - Texte -->
				<div class="space-y-6">
					<h2 class="text-4xl font-bold text-foreground">Qui je suis</h2>
					<p class="text-lg text-muted-foreground leading-relaxed">
						Après plusieurs années à faire évoluer le même produit web, j'ai appris à penser long
						terme : code maintenable, décisions techniques argumentées et respect des contraintes
						métier.
					</p>
					<p class="text-lg text-muted-foreground leading-relaxed">
						Mon terrain de jeu principal reste le front (Svelte, intégration, UX), mais avec une
						sensibilité produit et organisation qui me pousse naturellement vers la coordination et
						le support d'équipe.
					</p>
				</div>

				<!-- Colonne de droite - Illustration -->
				<div>
					<Card class="p-8 bg-linear-to-br from-primary/5 to-secondary/5 border-primary/10">
						<CardContent class="space-y-4">
							<div class="flex items-center space-x-4">
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
							<div class="flex items-center space-x-4">
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
							<div class="flex items-center space-x-4">
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

	<!-- Section Ce que j'aime construire -->
	<section class="py-24 bg-muted/30">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-foreground mb-4">Ce que j'aime construire</h2>
				<p class="text-lg text-muted-foreground">Mes domaines de prédilection</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Dashboard SaaS -->
				<div>
					<Card class="h-full p-6 hover:shadow-lg transition-shadow">
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
				<div>
					<Card class="h-full p-6 hover:shadow-lg transition-shadow">
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
				<div>
					<Card class="h-full p-6 hover:shadow-lg transition-shadow">
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
								Builders, visualisations, mini-apps interactives pour garder un pied dans le côté
								fun du web.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</section>

	<!-- Section Vision long terme -->
	<section class="py-24">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<!-- Colonne de gauche - Visuel -->
				<div>
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
				<div class="space-y-6">
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

	<!-- Section Ce site -->
	<section class="py-24 bg-muted/30">
		<div class="container mx-auto px-4">
			<div class="max-w-4xl mx-auto text-center space-y-8">
				<h2 class="text-4xl font-bold text-foreground">Ce site et ma façon de travailler</h2>
				<p class="text-lg text-muted-foreground leading-relaxed">
					Ce site me sert de terrain d'expérimentation et de démonstration
				</p>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
					<div>
						<Card class="p-6 h-full">
							<CardContent class="space-y-4">
								<div
									class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
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
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 class="font-semibold mb-2">Partie "Pro"</h3>
								<p class="text-sm text-muted-foreground">
									Produit web moderne, modulaire et évolutif
								</p>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card class="p-6 h-full">
							<CardContent class="space-y-4">
								<div
									class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
								>
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
											d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
										/>
									</svg>
								</div>
								<h3 class="font-semibold mb-2">Partie "Gaming"</h3>
								<p class="text-sm text-muted-foreground">APIs, performance et UI créatives</p>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card class="p-6 h-full">
							<CardContent class="space-y-4">
								<div
									class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
								>
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
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<h3 class="font-semibold mb-2">"Lab"</h3>
								<p class="text-sm text-muted-foreground">Idées sans contrainte, R&D interne</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Section Personnel -->
	<section class="py-24">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<div class="space-y-6">
					<h2 class="text-4xl font-bold text-foreground">Un peu plus personnel</h2>
					<p class="text-lg text-muted-foreground leading-relaxed">
						En dehors du code, il y a surtout :
					</p>
					<div class="space-y-4">
						<div class="flex items-start space-x-4">
							<div
								class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1"
							>
								<span class="text-lg">🎮</span>
							</div>
							<div>
								<h3 class="font-semibold mb-1">Jeux vidéo</h3>
								<p class="text-muted-foreground">
									Nourrissent ma curiosité pour les systèmes, les builds, les mécaniques cachées
								</p>
							</div>
						</div>

						<div class="flex items-start space-x-4">
							<div
								class="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0 mt-1"
							>
								<span class="text-lg">⚙️</span>
							</div>
							<div>
								<h3 class="font-semibold mb-1">Mécanique / Technique</h3>
								<p class="text-muted-foreground">
									Le goût de "comprendre comment ça marche" avant de vouloir l'améliorer
								</p>
							</div>
						</div>

						<div class="flex items-start space-x-4">
							<div
								class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-1"
							>
								<span class="text-lg">😊</span>
							</div>
							<div>
								<h3 class="font-semibold mb-1">Ambiance saine</h3>
								<p class="text-muted-foreground">
									Être sérieux sur le fond sans se prendre au sérieux sur la forme
								</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<Card class="p-8 bg-linear-to-br from-primary/5 to-secondary/5">
						<CardContent class="text-center space-y-6">
							<div
								class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
							>
								<svg
									class="w-10 h-10 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 class="text-2xl font-bold">Prêt à collaborer ?</h3>
							<p class="text-muted-foreground">
								Si tu cherches quelqu'un pour faire grandir un produit web sur la durée, faire le
								lien entre tech et métier, et construire quelque chose d'utile avec une équipe, on
								peut en discuter.
							</p>
							<Button href="/contact" class="mt-4">Démarrer la conversation</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* Grid background */
	.bg-size-\[50px_50px\] {
		background-size: 50px 50px;
	}
</style>
