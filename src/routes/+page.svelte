<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
</script>

<svelte:head>
	<title>NPaulusWebsite - Développeur Web & Créateur</title>
	<meta name="description" content="Bienvenue sur mon site web personnel. Découvrez mon portfolio, mes passions gaming et mon blog technique." />
</svelte:head>

<section class="relative min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-background">
	<div class="absolute inset-0 bg-grid-white/[0.02] bg-size-[50px_50px]" />
	<div class="relative z-10 container mx-auto px-4 text-center">
		<div class="max-w-4xl mx-auto space-y-8">
			<!-- Avatar/Logo -->
			<div class="flex justify-center mb-8">
				<div class="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-5xl font-bold shadow-lg">
					NP
				</div>
			</div>
			
			<!-- Hero Content -->
			<div class="space-y-6">
				<h1 class="text-5xl md:text-7xl font-bold bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
					NPaulusWebsite
				</h1>
				
				<p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					Développeur web passionné, créateur de contenu et gamer dans l'âme. 
					Bienvenue sur mon espace personnel où je partage mes projets, 
					mes réflexions et mes passions.
				</p>
			</div>
			
			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<Button variant="default" size="lg" class="text-lg px-8 py-3">
					<a href="/portfolio" class="flex items-center gap-2">
						💼 Voir mon Portfolio
					</a>
				</Button>
				<Button variant="outline" size="lg" class="text-lg px-8 py-3">
					<a href="/contact" class="flex items-center gap-2">
						📧 Me contacter
					</a>
				</Button>
			</div>
			
			<!-- Quick Stats -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
				<div class="bg-card border rounded-lg p-6 text-center">
					<div class="text-3xl font-bold text-primary mb-2">5+</div>
					<div class="text-sm text-muted-foreground">Années d'expérience</div>
				</div>
				<div class="bg-card border rounded-lg p-6 text-center">
					<div class="text-3xl font-bold text-primary mb-2">50+</div>
					<div class="text-sm text-muted-foreground">Projets réalisés</div>
				</div>
				<div class="bg-card border rounded-lg p-6 text-center">
					<div class="text-3xl font-bold text-primary mb-2">15+</div>
					<div class="text-sm text-muted-foreground">Articles de blog</div>
				</div>
				<div class="bg-card border rounded-lg p-6 text-center">
					<div class="text-3xl font-bold text-primary mb-2">∞</div>
					<div class="text-sm text-muted-foreground">Heures de gaming</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<div class="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
			<div class="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
		</div>
	</div>
</section>

<!-- Recent Section -->
<section class="py-20 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
				Découvrez mes univers
			</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				Quatre espaces pour explorer mon travail technique, mes passions gaming, 
				mes réflexions et me contacter.
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Portfolio Card -->
			<a href="/portfolio" class="group">
				<div class="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl mb-4">
						💼
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
						Portfolio
					</h3>
					<p class="text-muted-foreground mb-4">
						Mes projets web, applications et réalisations techniques.
					</p>
					<div class="flex items-center text-primary text-sm font-medium">
						Explorer <span class="ml-1">→</span>
					</div>
				</div>
			</a>
			
			<!-- Gaming Card -->
			<a href="/gaming" class="group">
				<div class="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground text-xl mb-4">
						🎮
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
						Gaming
					</h3>
					<p class="text-muted-foreground mb-4">
						Mes jeux préférés, achievements et expériences gaming.
					</p>
					<div class="flex items-center text-primary text-sm font-medium">
						Jouer <span class="ml-1">→</span>
					</div>
				</div>
			</a>
			
			<!-- Blog Card -->
			<a href="/blog" class="group">
				<div class="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div class="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-accent-foreground text-xl mb-4">
						📝
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
						Blog
					</h3>
					<p class="text-muted-foreground mb-4">
						Articles techniques, tutoriels et réflexions sur le dev.
					</p>
					<div class="flex items-center text-primary text-sm font-medium">
						Lire <span class="ml-1">→</span>
					</div>
				</div>
			</a>
			
			<!-- Contact Card -->
			<a href="/contact" class="group">
				<div class="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
					<div class="w-12 h-12 bg-destructive rounded-lg flex items-center justify-center text-destructive-foreground text-xl mb-4">
						📧
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
						Contact
					</h3>
					<p class="text-muted-foreground mb-4">
						Pour vos projets, collaborations ou simplement échanger.
					</p>
					<div class="flex items-center text-primary text-sm font-medium">
						Contacter <span class="ml-1">→</span>
					</div>
				</div>
			</a>
		</div>
	</div>
</section>

<style>
	/* Grid background pattern */
	.bg-grid-white\/\[0\.02\] {
		background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
	}
</style>
