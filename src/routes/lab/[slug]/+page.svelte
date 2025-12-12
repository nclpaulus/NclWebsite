<script lang="ts">
	/** Page détail d’une expérience technique avec navigation dynamique. */
	import { page } from '$app/state';
	import { experiments, getExperimentBySlug } from '$lib/data/experiments';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';

	const slug = $derived(page.params.slug);
	const experiment = $derived(getExperimentBySlug(slug || ''));

	function goBack() {
		goto('/lab');
	}
</script>

<svelte:head>
	<title>{experiment?.title || 'Expérience'} - Lab - WeCraft</title>
	<meta
		name="description"
		content={experiment?.description || "Détail de l'expérience technique"}
	/>
</svelte:head>

{#if experiment}
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Back Button -->
			<Button variant="ghost" size="sm" onclick={goBack} class="mb-6">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Retour au Lab
			</Button>

			<!-- Header -->
			<div class="text-center mb-12">
				<div class="flex items-center justify-center gap-3 mb-4">
					<h1 class="text-4xl md:text-5xl font-bold text-foreground">
						{experiment.title}
					</h1>
					<div class="flex gap-2">
						<Badge
							variant={experiment.type === 'demo'
								? 'default'
								: experiment.type === 'tool'
									? 'secondary'
									: 'outline'}
							class="text-sm"
						>
							{experiment.type}
						</Badge>
						<Badge variant="outline" class="text-sm">
							{experiment.difficulty}
						</Badge>
					</div>
				</div>
				<p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
					{experiment.description}
				</p>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-4 justify-center mb-12">
				{#if experiment.liveUrl}
					<Button variant="default" size="lg" asChild>
						<a href={experiment.liveUrl} target="_blank" rel="noopener noreferrer">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							Voir la démo
						</a>
					</Button>
				{/if}
				{#if experiment.githubUrl}
					<Button variant="outline" size="lg" asChild>
						<a href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							Voir le code
						</a>
					</Button>
				{/if}
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Column -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Problem Section -->
					<Card>
						<CardContent class="p-6">
							<h2 class="text-2xl font-semibold text-foreground mb-4 flex items-center">
								<span class="text-2xl mr-3">🎯</span>
								Problème
							</h2>
							<p class="text-muted-foreground leading-relaxed">
								{experiment.problem}
							</p>
						</CardContent>
					</Card>

					<!-- Solution Section -->
					<Card>
						<CardContent class="p-6">
							<h2 class="text-2xl font-semibold text-foreground mb-4 flex items-center">
								<span class="text-2xl mr-3">💡</span>
								Solution
							</h2>
							<p class="text-muted-foreground leading-relaxed">
								{experiment.solution}
							</p>
						</CardContent>
					</Card>
				</div>

				<!-- Right Column -->
				<div class="space-y-6">
					<!-- Tech Stack -->
					<Card>
						<CardContent class="p-6">
							<h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
								<span class="text-xl mr-2">🛠️</span>
								Technologies
							</h3>
							<div class="space-y-2">
								{#each experiment.techStack as tech (tech)}
									<Badge variant="secondary" class="mr-2 mb-2">{tech}</Badge>
								{/each}
							</div>
						</CardContent>
					</Card>

					<!-- Metadata -->
					<Card>
						<CardContent class="p-6">
							<h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
								<span class="text-xl mr-2">📊</span>
								Informations
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Type</span>
									<Badge variant="outline" class="text-xs">{experiment.type}</Badge>
								</div>
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Difficulté</span>
									<Badge variant="outline" class="text-xs">{experiment.difficulty}</Badge>
								</div>
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Date</span>
									<span class="text-sm font-medium">
										{new Date(experiment.date).toLocaleDateString('fr-FR', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<!-- Tags -->
					<Card>
						<CardContent class="p-6">
							<h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
								<span class="text-xl mr-2">🏷️</span>
								Tags
							</h3>
							<div class="flex flex-wrap gap-1">
								{#each experiment.tags as tag (tag)}
									<Badge variant="outline" class="text-xs">{tag}</Badge>
								{/each}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Related Experiments -->
			<div class="mt-12">
				<h2 class="text-2xl font-semibold text-foreground mb-6">Expériences similaires</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each experiments
						.filter((exp) => exp.slug !== slug && exp.type === experiment.type)
						.slice(0, 3) as related (related.slug)}
						<Card class="group hover:shadow-md transition-all">
							<CardContent class="p-4">
								<h4
									class="font-medium text-foreground mb-2 group-hover:text-primary transition-colors"
								>
									{related.title}
								</h4>
								<p class="text-sm text-muted-foreground line-clamp-2 mb-3">
									{related.description}
								</p>
								<Button variant="outline" size="sm" asChild>
									<a href="/lab/{related.slug}">Voir</a>
								</Button>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-2xl mx-auto text-center">
			<div class="text-6xl mb-4">🧪</div>
			<h1 class="text-3xl font-bold text-foreground mb-4">Expérience non trouvée</h1>
			<p class="text-muted-foreground mb-8">Cette expérience n'existe pas ou a été déplacée.</p>
			<Button variant="default" onclick={goBack}>Retour au Lab</Button>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
