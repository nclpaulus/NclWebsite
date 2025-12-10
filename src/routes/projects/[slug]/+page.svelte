<script lang="ts">
	import { page } from '$app/state';
	import { projects, getProjectBySlug } from '$lib/data/projects';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';

	const slug = $derived(page.params.slug || '');
	const project = $derived(getProjectBySlug(slug));

	function goBack() {
		goto('/projects');
	}
</script>

<svelte:head>
	<title>{project?.title || 'Projet'} - Projets - NPaulusWebsite</title>
	<meta
		name="description"
		content={project?.description || 'Détail du projet web'}
	/>
</svelte:head>

{#if project}
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Back Button -->
			<Button variant="ghost" size="sm" onclick={goBack} class="mb-6">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Retour aux projets
			</Button>

			<!-- Header -->
			<div class="text-center mb-12">
				<div class="flex items-center justify-center gap-3 mb-4">
					<h1 class="text-4xl md:text-5xl font-bold text-foreground">
						{project.title}
					</h1>
					<div class="flex gap-2">
						<Badge 
							variant={project.type === 'real' ? 'default' : project.type === 'mock' ? 'secondary' : 'outline'}
							class="text-sm"
						>
							{project.type === 'real' ? 'Réel' : project.type === 'mock' ? 'Fictif' : 'Démo'}
						</Badge>
						<Badge 
							variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}
							class="text-sm"
						>
							{project.status === 'completed' ? 'Terminé' : project.status === 'in-progress' ? 'En cours' : 'Prototype'}
						</Badge>
					</div>
				</div>
				<p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
					{project.description}
				</p>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-4 justify-center mb-12">
				<a 
					href={project.liveUrl} 
					target="_blank" 
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2 text-lg"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
					Voir le projet
				</a>
				<a 
					href={project.githubUrl} 
					target="_blank" 
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2 text-lg"
				>
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					Voir le code
				</a>
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Column -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Context Section -->
					<Card>
						<CardContent class="p-6">
							<h2 class="text-2xl font-semibold text-foreground mb-4 flex items-center">
								<span class="text-2xl mr-3">📋</span>
								Contexte
							</h2>
							<p class="text-muted-foreground leading-relaxed">
								{project.context}
							</p>
							{#if project.client}
								<div class="mt-4 p-4 bg-muted/50 rounded-lg">
									<span class="font-medium text-foreground">Client :</span>
									<span class="text-muted-foreground ml-2">{project.client}</span>
								</div>
							{/if}
						</CardContent>
					</Card>

					<!-- Features Section -->
					<Card>
						<CardContent class="p-6">
							<h2 class="text-2xl font-semibold text-foreground mb-4 flex items-center">
								<span class="text-2xl mr-3">✨</span>
								Fonctionnalités
							</h2>
							<ul class="space-y-3">
								{#each project.features as feature}
									<li class="flex items-start">
										<span class="text-primary mr-3 mt-1 text-lg">•</span>
										<span class="text-muted-foreground leading-relaxed">{feature}</span>
									</li>
								{/each}
							</ul>
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
								Stack technique
							</h3>
							<div class="space-y-2">
								{#each project.techStack as tech}
									<Badge variant="secondary" class="mr-2 mb-2">{tech}</Badge>
								{/each}
							</div>
						</CardContent>
					</Card>

					<!-- Project Info -->
					<Card>
						<CardContent class="p-6">
							<h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
								<span class="text-xl mr-2">📊</span>
								Informations
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Type</span>
									<Badge variant="outline" class="text-xs">
										{project.type === 'real' ? 'Réel' : project.type === 'mock' ? 'Fictif' : 'Démo'}
									</Badge>
								</div>
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Statut</span>
									<Badge variant="outline" class="text-xs">
										{project.status === 'completed' ? 'Terminé' : project.status === 'in-progress' ? 'En cours' : 'Prototype'}
									</Badge>
								</div>
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Date</span>
									<span class="text-sm font-medium">
										{new Date(project.date).toLocaleDateString('fr-FR', { 
											day: 'numeric', 
											month: 'long', 
											year: 'numeric' 
										})}
									</span>
								</div>
								{#if project.client}
									<div class="flex justify-between">
										<span class="text-sm text-muted-foreground">Client</span>
										<span class="text-sm font-medium">{project.client}</span>
									</div>
								{/if}
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
								{#each project.tags as tag}
									<Badge variant="outline" class="text-xs">{tag}</Badge>
								{/each}
							</div>
						</CardContent>
					</Card>

					<!-- Quick Links -->
					<Card>
						<CardContent class="p-6">
							<h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
								<span class="text-xl mr-2">🔗</span>
								Liens rapides
							</h3>
							<div class="space-y-2">
								<a 
									href={project.liveUrl} 
									target="_blank" 
									rel="noopener noreferrer"
									class="inline-flex items-center justify-start rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 w-full"
								>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
									Démo en ligne
								</a>
								<a 
									href={project.githubUrl} 
									target="_blank" 
									rel="noopener noreferrer"
									class="inline-flex items-center justify-start rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 w-full"
								>
										<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
										</svg>
										Code source
								</a>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<!-- Related Projects -->
			<div class="mt-12">
				<h2 class="text-2xl font-semibold text-foreground mb-6">Projets similaires</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each projects.filter(p => p.slug !== slug && p.type === project.type).slice(0, 3) as related}
						<Card class="group hover:shadow-md transition-all">
							<CardContent class="p-4">
								<h4 class="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
									{related.title}
								</h4>
								<p class="text-sm text-muted-foreground line-clamp-2 mb-3">
									{related.description}
								</p>
								<a 
									href="/projects/{related.slug}"
									class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2"
								>Voir</a>
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
			<div class="text-6xl mb-4">🚀</div>
			<h1 class="text-3xl font-bold text-foreground mb-4">Projet non trouvé</h1>
			<p class="text-muted-foreground mb-8">
				Ce projet n'existe pas ou a été déplacé.
			</p>
			<Button variant="default" onclick={goBack}>
				Retour aux projets
			</Button>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style>
