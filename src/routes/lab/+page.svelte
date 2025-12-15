<script lang="ts">
	/** Page Lab affichant les expériences interactives (démos, outils, POCs). */
	import { experiments, getExperimentsByType } from '$lib/data/experiments';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	
	// État pour le filtre actif
	let activeFilter: 'all' | 'demo' | 'tool' | 'poc' = 'all';
	
	// Expériences filtrées selon le filtre actif
	$: filteredExperiments = activeFilter === 'all' 
		? experiments 
		: getExperimentsByType(activeFilter);
	
	// Fonction pour changer le filtre
	function setFilter(filter: typeof activeFilter) {
		activeFilter = filter;
	}
</script>

<svelte:head>
	<title>Lab - WeCraft</title>
	<meta
		name="description"
		content="Mon laboratoire d'expériences interactives : démos SvelteKit, outils techniques et POCs"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1
				class="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
			>
				🧪 Lab & Experiments
			</h1>
			<p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
				Explorez mes expériences interactives, démos techniques et outils créés avec SvelteKit.
				Chaque projet résout un problème spécifique et documente ma démarche technique.
			</p>
		</div>

		<!-- Filter Tags -->
		<div class="mb-8 flex flex-wrap gap-2 justify-center">
			<Badge
				variant={activeFilter === 'all' ? 'default' : 'secondary'}
				class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				onclick={() => setFilter('all')}
			>
				Tous ({experiments.length})
			</Badge>
			<Badge
				variant={activeFilter === 'demo' ? 'default' : 'outline'}
				class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				onclick={() => setFilter('demo')}
			>
				Démos ({getExperimentsByType('demo').length})
			</Badge>
			<Badge
				variant={activeFilter === 'tool' ? 'default' : 'outline'}
				class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				onclick={() => setFilter('tool')}
			>
				Outils ({getExperimentsByType('tool').length})
			</Badge>
			<Badge
				variant={activeFilter === 'poc' ? 'default' : 'outline'}
				class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				onclick={() => setFilter('poc')}
			>
				POCs ({getExperimentsByType('poc').length})
			</Badge>
		</div>

		<!-- Experiments Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredExperiments as experiment (experiment.slug)}
				<Card class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<CardContent class="p-6">
						<!-- Header -->
						<div class="flex items-start justify-between mb-4">
							<div class="flex-1">
								<h3
									class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
								>
									{experiment.title}
								</h3>
								<div class="flex items-center gap-2 mb-3">
									<Badge
										variant={experiment.type === 'demo'
											? 'default'
											: experiment.type === 'tool'
												? 'secondary'
												: 'outline'}
										class="text-xs"
									>
										{experiment.type}
									</Badge>
									<Badge variant="outline" class="text-xs">
										{experiment.difficulty}
									</Badge>
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="text-muted-foreground mb-4 line-clamp-3">
							{experiment.description}
						</p>

						<!-- Problem/Solution -->
						<div class="space-y-2 mb-4">
							<div class="text-sm">
								<span class="font-medium text-foreground">Problème :</span>
								<p class="text-muted-foreground line-clamp-2">{experiment.problem}</p>
							</div>
							<div class="text-sm">
								<span class="font-medium text-foreground">Solution :</span>
								<p class="text-muted-foreground line-clamp-2">{experiment.solution}</p>
							</div>
						</div>

						<!-- Tech Stack -->
						<div class="flex flex-wrap gap-1 mb-4">
							{#each experiment.techStack.slice(0, 3) as tech (tech)}
								<Badge variant="outline" class="text-xs">{tech}</Badge>
							{/each}
							{#if experiment.techStack.length > 3}
								<Badge variant="outline" class="text-xs">+{experiment.techStack.length - 3}</Badge>
							{/if}
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-between pt-4 border-t">
							<span class="text-xs text-muted-foreground">
								{new Date(experiment.date).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}
							</span>
							<div class="flex gap-2">
								<Button variant="outline" size="sm" asChild>
									<a href="/lab/{experiment.slug}">Voir</a>
								</Button>
								{#if experiment.liveUrl}
									<Button variant="ghost" size="sm" asChild>
										<a
											href={experiment.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											aria-label="View live demo of {experiment.title}"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									</Button>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Empty State -->
		{#if filteredExperiments.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🧪</div>
				<h3 class="text-xl font-semibold text-foreground mb-2">Aucune expérience pour ce filtre</h3>
				<p class="text-muted-foreground">
					Essayez un autre filtre ou revenez à "Tous" pour voir toutes les expériences.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-3 {
		display: -webkit-box;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
