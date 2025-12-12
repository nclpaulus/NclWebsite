<script lang="ts">
	/** Page portfolio affichant les projets et réalisations professionnelles. */
	import { projects, getFeaturedProjects, getProjectsByType } from '$lib/data/projects';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Projets - WeCraft</title>
	<meta
		name="description"
		content="Découvrez mes projets web : applications SaaS, dashboards, et démonstrations techniques"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1
				class="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
			>
				🚀 Projets
			</h1>
			<p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
				Explorez mes réalisations : projets réels, démonstrations techniques et concepts fictifs.
				Chaque projet montre ma capacité à créer des solutions web complètes et modernes.
			</p>
		</div>

		<!-- Featured Projects -->
		{#if getFeaturedProjects().length > 0}
			<section class="mb-12">
				<h2 class="text-2xl font-semibold text-foreground mb-6 flex items-center">
					<span class="text-2xl mr-3">⭐</span>
					Projets en vedette
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each getFeaturedProjects() as project (project.slug)}
						<Card
							class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20"
						>
							<CardContent class="p-6">
								<!-- Header -->
								<div class="flex items-start justify-between mb-4">
									<div class="flex-1">
										<h3
											class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
										>
											{project.title}
										</h3>
										<div class="flex items-center gap-2 mb-3">
											<Badge
												variant={project.type === 'real'
													? 'default'
													: project.type === 'mock'
														? 'secondary'
														: 'outline'}
												class="text-xs"
											>
												{project.type === 'real'
													? 'Réel'
													: project.type === 'mock'
														? 'Fictif'
														: 'Démo'}
											</Badge>
											<Badge
												variant="outline"
												class="text-xs bg-green-50 text-green-700 border-green-200"
											>
												Terminé
											</Badge>
										</div>
									</div>
								</div>

								<!-- Description -->
								<p class="text-muted-foreground mb-4 line-clamp-3">
									{project.description}
								</p>

								<!-- Context -->
								<div class="text-sm mb-4">
									<span class="font-medium text-foreground">Contexte :</span>
									<p class="text-muted-foreground line-clamp-2">{project.context}</p>
								</div>

								<!-- Tech Stack -->
								<div class="flex flex-wrap gap-1 mb-4">
									{#each project.techStack.slice(0, 4) as tech (tech)}
										<Badge variant="outline" class="text-xs">{tech}</Badge>
									{/each}
									{#if project.techStack.length > 4}
										<Badge variant="outline" class="text-xs">+{project.techStack.length - 4}</Badge>
									{/if}
								</div>

								<!-- Footer -->
								<div class="flex items-center justify-between pt-4 border-t">
									<span class="text-xs text-muted-foreground">
										{new Date(project.date).toLocaleDateString('fr-FR', {
											day: 'numeric',
											month: 'short',
											year: 'numeric'
										})}
									</span>
									<div class="flex gap-2">
										<Button variant="outline" size="sm" asChild>
											<a href="/projects/{project.slug}">Détails</a>
										</Button>
										<Button variant="ghost" size="sm" asChild>
											<a
												href={project.liveUrl}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Voir le projet en direct"
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
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Filter Section -->
		<div class="mb-8">
			<h2 class="text-xl font-semibold text-foreground mb-4">Tous les projets</h2>
			<div class="flex flex-wrap gap-2">
				<Badge
					variant="secondary"
					class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				>
					Tous ({projects.length})
				</Badge>
				<Badge
					variant="outline"
					class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				>
					Réels ({getProjectsByType('real').length})
				</Badge>
				<Badge
					variant="outline"
					class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				>
					Fictifs ({getProjectsByType('mock').length})
				</Badge>
				<Badge
					variant="outline"
					class="cursor-pointer hover:bg-primary hover:text-primary-foreground"
				>
					Démos ({getProjectsByType('demo').length})
				</Badge>
			</div>
		</div>

		<!-- All Projects Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project (project.slug)}
				<Card class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<CardContent class="p-6">
						<!-- Header -->
						<div class="flex items-start justify-between mb-4">
							<div class="flex-1">
								<h3
									class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
								>
									{project.title}
								</h3>
								<div class="flex items-center gap-2 mb-3">
									<Badge
										variant={project.type === 'real'
											? 'default'
											: project.type === 'mock'
												? 'secondary'
												: 'outline'}
										class="text-xs"
									>
										{project.type === 'real' ? 'Réel' : project.type === 'mock' ? 'Fictif' : 'Démo'}
									</Badge>
									<Badge variant="outline" class="text-xs">
										{project.status === 'completed'
											? 'Terminé'
											: project.status === 'in-progress'
												? 'En cours'
												: 'Prototype'}
									</Badge>
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="text-muted-foreground mb-4 line-clamp-2">
							{project.description}
						</p>

						<!-- Client (for mock projects) -->
						{#if project.client}
							<div class="text-sm mb-3">
								<span class="font-medium text-foreground">Client :</span>
								<span class="text-muted-foreground ml-1">{project.client}</span>
							</div>
						{/if}

						<!-- Features Preview -->
						<div class="mb-4">
							<div class="text-sm font-medium text-foreground mb-1">Points clés :</div>
							<ul class="text-sm text-muted-foreground space-y-1">
								{#each project.features.slice(0, 2) as feature (feature)}
									<li class="flex items-start">
										<span class="text-primary mr-2">•</span>
										<span class="line-clamp-1">{feature}</span>
									</li>
								{/each}
								{#if project.features.length > 2}
									<li class="text-primary text-xs">+{project.features.length - 2} autres...</li>
								{/if}
							</ul>
						</div>

						<!-- Tech Stack -->
						<div class="flex flex-wrap gap-1 mb-4">
							{#each project.techStack.slice(0, 3) as tech (tech)}
								<Badge variant="outline" class="text-xs">{tech}</Badge>
							{/each}
							{#if project.techStack.length > 3}
								<Badge variant="outline" class="text-xs">+{project.techStack.length - 3}</Badge>
							{/if}
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-between pt-4 border-t">
							<span class="text-xs text-muted-foreground">
								{new Date(project.date).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}
							</span>
							<div class="flex gap-2">
								<Button variant="outline" size="sm" asChild>
									<a href="/projects/{project.slug}">Détails</a>
								</Button>
								<Button variant="ghost" size="sm" asChild>
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Voir le projet en direct"
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
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Empty State -->
		{#if projects.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🚀</div>
				<h3 class="text-xl font-semibold text-foreground mb-2">Aucun projet pour le moment</h3>
				<p class="text-muted-foreground">
					Je travaille actuellement sur de nouveaux projets à partager bientôt !
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
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
