<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
</script>

<svelte:head>
	<title>Blog - NPaulusWebsite</title>
	<meta name="description" content="Mes articles, tutoriels et thoughts sur le développement web et technologie" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-6 text-primary">Blog</h1>
	<p class="text-lg text-muted-foreground mb-8">
		Découvrez mes articles, tutoriels et réflexions sur le développement web, les nouvelles technologies et mes expériences.
	</p>
	
	<div class="space-y-8">
		<article class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<h2 class="text-2xl font-semibold text-foreground mb-2">
						<a href="/blog/article-1" class="hover:text-primary transition-colors">
							Migration de Tailwind v3 vers v4 : Guide complet
						</a>
					</h2>
					<p class="text-muted-foreground mb-4">
						Découvrez comment migrer votre projet SvelteKit de Tailwind CSS v3 vers v4 avec la nouvelle syntaxe @theme inline et shadcn-svelte.
					</p>
					<div class="flex items-center gap-4 text-sm text-muted-foreground">
						<span>📅 15 décembre 2024</span>
						<span>⏱️ 8 min de lecture</span>
						<span>🏷️ Tailwind CSS</span>
					</div>
				</div>
			</div>
		</article>
		
		<article class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<h2 class="text-2xl font-semibold text-foreground mb-2">
						<a href="/blog/article-2" class="hover:text-primary transition-colors">
							SvelteKit vs Next.js : Lequel choisir en 2024 ?
						</a>
					</h2>
					<p class="text-muted-foreground mb-4">
						Comparaison détaillée entre SvelteKit et Next.js pour vos projets web modernes. Performances, DX et écosystème.
					</p>
					<div class="flex items-center gap-4 text-sm text-muted-foreground">
						<span>📅 10 décembre 2024</span>
						<span>⏱️ 12 min de lecture</span>
						<span>🏷️ Framework</span>
					</div>
				</div>
			</div>
		</article>
		
		<article class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<h2 class="text-2xl font-semibold text-foreground mb-2">
						<a href="/blog/article-3" class="hover:text-primary transition-colors">
							Les meilleures pratiques TypeScript en 2024
						</a>
					</h2>
					<p class="text-muted-foreground mb-4">
						Optimisez votre code TypeScript avec les dernières fonctionnalités et patterns recommandés par la communauté.
					</p>
					<div class="flex items-center gap-4 text-sm text-muted-foreground">
						<span>📅 5 décembre 2024</span>
						<span>⏱️ 10 min de lecture</span>
						<span>🏷️ TypeScript</span>
					</div>
				</div>
			</div>
		</article>
	</div>
	
	<div class="mt-12 flex justify-center">
		<div class="flex gap-2">
			<Button variant="outline" disabled>Précédent</Button>
			<Button variant="default">1</Button>
			<Button variant="outline">2</Button>
			<Button variant="outline">3</Button>
			<Button variant="outline">Suivant</Button>
		</div>
	</div>
</div>
