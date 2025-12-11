<script lang="ts">
	import { profile } from '$lib/stores/profile';
	import type { Profile } from '$lib/services/profileDB';
	import Button from '$lib/components/ui/button.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';

	const profiles = [
		{
			id: 'pro' as Profile,
			name: 'Professionnel',
			icon: '💼',
			description: 'Portfolio, projets, expertise technique',
			features: ['Projets réalisés', 'Compétences techniques', 'Expérience professionnelle'],
			color: 'bg-blue-500',
			hoverColor: 'hover:bg-blue-600',
			gradient: 'from-blue-500 to-blue-700',
			borderColor: 'border-blue-200/50',
			hoverBorderColor: 'hover:border-blue-400/70',
			shadowColor: 'shadow-blue-500/20',
			hoverShadowColor: 'hover:shadow-blue-500/40',
			bgStyle: 'bg-white/80 backdrop-blur-sm',
			featureDot: 'bg-blue-500',
			buttonVariant: 'bg-blue-600 hover:bg-blue-700 text-white'
		},
		{
			id: 'gamer' as Profile,
			name: 'Gamer',
			icon: '🎮',
			description: 'Stats, achievements, communauté',
			features: ['Statistiques gaming', 'Achievements', 'Communauté'],
			color: 'bg-red-500',
			hoverColor: 'hover:bg-red-600',
			gradient: 'from-red-500 to-purple-700',
			borderColor: 'border-red-300/50',
			hoverBorderColor: 'hover:border-red-500/70',
			shadowColor: 'shadow-red-500/30',
			hoverShadowColor: 'hover:shadow-red-500/60 hover:shadow-2xl',
			bgStyle: 'bg-gray-900/90 backdrop-blur-md',
			featureDot: 'bg-red-500',
			buttonVariant:
				'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white'
		},
		{
			id: 'lambda' as Profile,
			name: 'Personnel',
			icon: '👤',
			description: 'Blog, hobbies, vie quotidienne',
			features: ['Blog personnel', 'Hobbies', 'Réflexions'],
			color: 'bg-green-500',
			hoverColor: 'hover:bg-green-600',
			gradient: 'from-green-500 to-teal-700',
			borderColor: 'border-green-200/50',
			hoverBorderColor: 'hover:border-green-400/70',
			shadowColor: 'shadow-green-500/20',
			hoverShadowColor: 'hover:shadow-green-500/40',
			bgStyle: 'bg-gradient-to-br from-green-50/80 to-teal-50/80 backdrop-blur-sm',
			featureDot: 'bg-green-500',
			buttonVariant: 'bg-green-600 hover:bg-green-700 text-white'
		}
	];

	let selectedProfile: Profile | null = $state(null);
	let isLoading = $state(false);
	let isTransitioning = $state(false);

	// Obtenir la durée de transition pour un profil spécifique
	function getTransitionDuration(profileId: Profile): number {
		switch (profileId) {
			case 'pro':
				return 800;
			case 'gamer':
				return 600;
			case 'lambda':
				return 1000;
			default:
				return 500;
		}
	}

	// Routes spécifiques pour chaque profil
	function getProfileRoute(profileId: Profile): string {
		switch (profileId) {
			case 'pro':
				return '/portfolio';
			case 'gamer':
				return '/gaming';
			case 'lambda':
				return '/';
			default:
				return '/';
		}
	}

	async function selectProfile(profileId: Profile) {
		if (isLoading || isTransitioning) return;

		isLoading = true;
		isTransitioning = true;
		selectedProfile = profileId;

		try {
			// Attendre la fin de la transition spécifique au profil
			const transitionDuration = getTransitionDuration(profileId);
			await new Promise(resolve => setTimeout(resolve, transitionDuration));
			
			await profile.switch(profileId);
			
			// Naviguer vers la route spécifique du profil
			const targetRoute = getProfileRoute(profileId);
			await goto(targetRoute);
		} catch (error) {
			console.error('Failed to switch profile:', error);
			isTransitioning = false;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-linear-to-br from-background via-muted/20 to-background p-4">
	<div class="container mx-auto max-w-6xl">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="flex justify-center mb-8 animate-fade-in">
				<Logo 
					size="xl" 
					fetchPriority="high" 
					class="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300" 
				/>
			</div>

			<h1 class="text-4xl md:text-6xl font-bold text-foreground mb-4">
				Ma Plateforme, votre Découverte
			</h1>

			<p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
				Bienvenue sur votre plateforme interactive. Choisissez votre profil et explorez un univers personnalisé,
				adapté à vos besoins et passions. Professionnel, gamer ou simple curieux, trouvez ici l'expérience qui vous correspond.
			</p>

			<div class="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
				<span>💡</span>
				<span>Vous pourrez changer de profil à tout moment</span>
			</div>
		</div>

		<!-- Profile Cards -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
			{#each profiles as p (p.id)}
				<button
					type="button"
					class="group relative w-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 {p.id ===
					'pro'
						? 'focus:ring-blue-500'
						: p.id === 'gamer'
							? 'focus:ring-red-500'
							: 'focus:ring-green-500'} focus:ring-offset-2"
					onclick={() => selectProfile(p.id)}
					disabled={isLoading && selectedProfile === p.id}
				>
					<div
						class="{p.bgStyle} border-2 {p.borderColor} {p.hoverBorderColor} rounded-2xl p-8 h-full {p.shadowColor} {p.hoverShadowColor} transition-all duration-300"
						out:fade={selectedProfile === p.id ? { duration: getTransitionDuration(p.id), easing: (t: number) => t * t } : undefined}
					>
						<!-- Profile Icon -->
						<div class="flex justify-center mb-6">
							<div
								class="w-24 h-24 bg-linear-to-br {p.gradient} rounded-2xl flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform {p.id ===
								'gamer'
									? 'animate-pulse'
									: ''}"
							>
								{p.icon}
							</div>
						</div>

						<!-- Profile Info -->
						<div class="text-center mb-6">
							<h2
								class="text-2xl font-bold {p.id === 'gamer'
									? 'text-white'
									: 'text-foreground'} mb-2"
							>
								{p.name}
							</h2>
							<p class="{p.id === 'gamer' ? 'text-gray-300' : 'text-muted-foreground'} mb-4">
								{p.description}
							</p>

							<!-- Features -->
							<div class="space-y-2">
								{#each p.features as feature (feature)}
									<div
										class="flex items-center justify-center space-x-2 text-sm {p.id === 'gamer'
											? 'text-gray-300'
											: 'text-muted-foreground'}"
									>
										<span class="w-1.5 h-1.5 {p.featureDot} rounded-full"></span>
										<span>{feature}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Select Button -->
						<div class="text-center">
							<Button
								variant="default"
								class="w-full group-hover:scale-105 transition-transform {p.buttonVariant}"
								disabled={isLoading && selectedProfile === p.id}
							>
								{#if isLoading && selectedProfile === p.id}
									<div class="flex items-center space-x-2">
										<div
											class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
										></div>
										<span>Chargement...</span>
									</div>
								{:else}
									<div class="flex items-center space-x-2">
										<span>Choisir ce profil</span>
										<span>→</span>
									</div>
								{/if}
							</Button>
						</div>
					</div>

					<!-- Tooltip -->
					<div
						class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<div
							class="{p.id === 'pro'
								? 'bg-blue-600'
								: p.id === 'gamer'
									? 'bg-red-600'
									: 'bg-green-600'} text-white text-xs px-3 py-1 rounded-full shadow-lg"
						>
							Cliquez pour commencer
						</div>
					</div>

					<!-- Selection indicator -->
					{#if selectedProfile === p.id}
						<div class="absolute top-4 right-4">
							<div
								class="w-8 h-8 {p.id === 'pro'
									? 'bg-blue-600'
									: p.id === 'gamer'
										? 'bg-red-600'
										: 'bg-green-600'} rounded-full flex items-center justify-center text-white animate-pulse"
							>
								✓
							</div>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Skip Option -->
		<div class="text-center">
			<div class="inline-flex items-center space-x-4 text-muted-foreground">
				<span>Ou</span>
				<button
					class="text-primary hover:text-primary/80 underline transition-colors"
					onclick={() => selectProfile('lambda')}
				>
					continuer sans choisir
				</button>
				<span>(profil par défaut)</span>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.8s ease-out;
	}
</style>
