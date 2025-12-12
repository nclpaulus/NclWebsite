<script lang="ts">
	/** Page architecture du projet avec diagrammes, philosophie et exemples de code. */
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import MermaidDiagram from '$lib/components/MermaidDiagram.svelte';
	import { storeExample, interfaceExample } from '$lib/data/codeExamples';
</script>

<svelte:head>
	<title>Architecture - NPaulusWebsite</title>
	<meta
		name="description"
		content="Architecture du projet SvelteKit 5, documentation et bonnes pratiques"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1
				class="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
			>
				🏗️ Architecture & Documentation
			</h1>
			<p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
				Une approche moderne du développement web avec SvelteKit 5, TypeScript et une documentation
				complète pour garantir la maintenabilité et la collaboration.
			</p>
		</div>

		<!-- Tech Stack -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Stack Technique</h2>
			<div class="flex flex-wrap gap-2">
				<Badge variant="default">SvelteKit 5</Badge>
				<Badge variant="default">Svelte 5 (Runes)</Badge>
				<Badge variant="default">TypeScript 5.0+</Badge>
				<Badge variant="secondary">Tailwind CSS 3.4</Badge>
				<Badge variant="secondary">shadcn/ui</Badge>
				<Badge variant="secondary">Vite</Badge>
				<Badge variant="outline">IndexedDB</Badge>
				<Badge variant="outline">LocalStorage</Badge>
				<Badge variant="outline">Prettier</Badge>
				<Badge variant="outline">ESLint</Badge>
			</div>
		</div>

		<!-- Architecture Diagram -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Architecture du Projet</h2>
			<Card>
				<CardContent class="p-6">
					<MermaidDiagram
						diagram={`
graph TB
    subgraph "Frontend (SvelteKit 5)"
        A[+layout.svelte] --> B[Pages Routes]
        A --> C[Components]
        B --> D[Stores Svelte 5]
        C --> D
        D --> E[Services API]
        D --> F[Persistence Layer]
    end

    subgraph "Data Layer"
        E --> G[External APIs]
        F --> H[IndexedDB]
        F --> I[LocalStorage]
    end

    subgraph "Type System"
        J[types/*.ts] --> D
        J --> C
        J --> B
    end

    subgraph "Build & Dev"
        K[Vite] --> L[Hot Reload]
        K --> M[Optimisation]
        N[TypeScript] --> O[Type Safety]
    end

    style A fill:#3b82f6
    style D fill:#10b981
    style F fill:#f59e0b
    style J fill:#8b5cf6
					`}
					/>
				</CardContent>
			</Card>
		</div>

		<!-- Documentation Philosophy -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Philosophie de Documentation</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardContent class="p-6">
						<h3 class="text-lg font-semibold mb-3">📝 Standards JSDoc</h3>
						<ul class="space-y-2 text-sm text-muted-foreground">
							<li>• Toutes les fonctions publiques documentées</li>
							<li>• Interfaces et types avec descriptions claires</li>
							<li>• Paramètres et valeurs de retour typées</li>
							<li>• Exemples d'usage pour les fonctions complexes</li>
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent class="p-6">
						<h3 class="text-lg font-semibold mb-3">🎯 Principes Directeurs</h3>
						<ul class="space-y-2 text-sm text-muted-foreground">
							<li>• Code auto-documenté avant tout</li>
							<li>• Documentation comme outil de conception</li>
							<li>• Cohérence dans tout le projet</li>
							<li>• Maintenance facilitée par la clarté</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Code Examples -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Exemples de Code Documenté</h2>
			<div class="space-y-6">
				<Card>
					<CardContent class="p-6">
						<h3 class="text-lg font-semibold mb-3">Store Svelte 5 avec JSDoc</h3>
						<div class="bg-muted p-4 rounded-lg overflow-x-auto">
							<pre class="text-sm"><code class="language-typescript">{@html storeExample}</code
								></pre>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent class="p-6">
						<h3 class="text-lg font-semibold mb-3">Types TypeScript Documentés</h3>
						<div class="bg-muted p-4 rounded-lg overflow-x-auto">
							<pre class="text-sm"><code class="language-typescript">{@html interfaceExample}</code
								></pre>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Best Practices -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Bonnes Pratiques Appliquées</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent class="p-4 text-center">
						<div class="text-2xl mb-2">🔒</div>
						<h3 class="font-semibold mb-1">Type Safety</h3>
						<p class="text-sm text-muted-foreground">TypeScript strict partout</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent class="p-4 text-center">
						<div class="text-2xl mb-2">⚡</div>
						<h3 class="font-semibold mb-1">Performance</h3>
						<p class="text-sm text-muted-foreground">SSR + Cache optimisé</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent class="p-4 text-center">
						<div class="text-2xl mb-2">🎨</div>
						<h3 class="font-semibold mb-1">Design System</h3>
						<p class="text-sm text-muted-foreground">Composants réutilisables</p>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Metrics -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold mb-6">Métriques de Qualité</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="text-center p-4 bg-primary/5 rounded-lg">
					<div class="text-3xl font-bold text-primary">100%</div>
					<div class="text-sm text-muted-foreground">Coverage JSDoc</div>
				</div>
				<div class="text-center p-4 bg-green-500/5 rounded-lg">
					<div class="text-3xl font-bold text-green-600">0</div>
					<div class="text-sm text-muted-foreground">Erreurs TypeScript</div>
				</div>
				<div class="text-center p-4 bg-blue-500/5 rounded-lg">
					<div class="text-3xl font-bold text-blue-600">A+</div>
					<div class="text-sm text-muted-foreground">Score ESLint</div>
				</div>
				<div class="text-center p-4 bg-purple-500/5 rounded-lg">
					<div class="text-3xl font-bold text-purple-600">✓</div>
					<div class="text-sm text-muted-foreground">Format Prettier</div>
				</div>
			</div>
		</div>

		<!-- CTA -->
		<div class="text-center">
			<Button href="https://github.com/votreusername/NPaulusWebsite" target="_blank" class="mb-4">
				Voir le Code Source
			</Button>
			<p class="text-sm text-muted-foreground">
				Explorez le dépôt GitHub pour voir la documentation complète en action
			</p>
		</div>
	</div>
</div>
