<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
</script>

<svelte:head>
	<title>Ma Plateforme, votre Découverte - NPaulusWebsite</title>
	<meta
		name="description"
		content="Bienvenue sur votre plateforme interactive. Choisissez votre profil et explorez un univers personnalisé, adapté à vos besoins et passions. Professionnel, gamer ou simple curieux, trouvez ici l'expérience qui vous correspond."
	/>
</svelte:head>

<section
	class="relative min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-background"
>
	<div class="absolute inset-0 bg-grid-white/[0.02] bg-size-[50px_50px]"></div>
	<div class="relative z-10 container mx-auto px-4 text-center">
		<div class="max-w-4xl mx-auto space-y-8">
			<!-- Avatar/Logo -->
			<div class="flex justify-center mb-8">
				<div
					class="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-5xl font-bold shadow-lg"
				>
					NP
				</div>
			</div>

			<!-- Hero Content -->
			<div class="space-y-6">
				<h1
					class="text-5xl md:text-7xl font-bold bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent"
				>
					Ma Plateforme, votre Découverte
				</h1>

				<p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					Professionnel, gamer ou simple curieux, trouvez ici l'expérience qui vous correspond.
				</p>
			</div>

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<Button variant="default" size="lg" class="text-lg px-8 py-3">
					<a
						href={page.url.pathname === '/contact' ? undefined : '/contact'}
						class="flex items-center gap-2"
					>
						📧 Me contacter
					</a>
				</Button>
				<Button variant="outline" size="lg" class="text-lg px-8 py-3">
					<a
						href={page.url.pathname === '/portfolio' ? undefined : '/portfolio'}
						class="flex items-center gap-2"
					>
						🚀 Voir mes projets
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
					<div class="text-3xl font-bold text-primary mb-2">5+</div>
					<div class="text-sm text-muted-foreground">Expériences Lab</div>
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
<section id="welcome" class="py-20 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">Bienvenue sur mon espace</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				Développeur web passionné, je partage ici mes réalisations et reste à votre disposition pour
				toute collaboration.
			</p>
		</div>

		<div class="flex justify-center">
			<div class="grid grid-cols-1 gap-6 max-w-md">
				<!-- Contact Card -->
				<a href="/contact" class="group">
					<div
						class="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl mb-4"
						>
							📧
						</div>
						<h3
							class="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
						>
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
	</div>
</section>

<style>
	/* Grid background pattern */
	.bg-grid-white\/\[0\.02\] {
		background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
	}
</style>
