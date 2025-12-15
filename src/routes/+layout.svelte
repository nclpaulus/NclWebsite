<script lang="ts">
	/** Layout racine avec navigation, sélecteur de profil et thème dynamique. */
	import '../app.css';
	import { page } from '$app/state';
	import { profile, hasProfile, profileInfo } from '$lib/stores/profile';
	import Navigation from '$lib/components/Navigation.svelte';
	import ProfileSelector from '$lib/components/ProfileSelector.svelte';
	import WeatherWidget from '$lib/components/weather/WeatherWidget.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
	let isInitializing = $state(true);

	// État dérivé pour éviter la race condition (compatible runes mode)
	const showProfileSelector = $derived(isInitializing ? false : !$hasProfile);

	// Initialiser le store au montage du composant
	onMount(async () => {
		if (browser) {
			await profile.init();
			isInitializing = false;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<title>Nicolas Paulus - Portfolio & Projets</title>
	<meta name="description" content="Développeur web passionné - Portfolio, projets créatifs, gaming et blog technique" />
</svelte:head>

<div class="min-h-screen bg-background profile-transition {$profile ? `profile-${$profile}` : ''}">
	{#if isInitializing}
		<!-- Loading skeleton pendant l'initialisation -->
		<div class="flex items-center justify-center min-h-screen">
			<div class="flex flex-col items-center space-y-4">
				<div class="w-16 h-16 bg-primary rounded-full animate-pulse"></div>
				<div class="text-muted-foreground">
					{#if $profile}
						Chargement du profil {profileInfo[$profile].name}...
					{:else}
						Chargement de votre profil...
					{/if}
				</div>
			</div>
		</div>
	{:else if showProfileSelector}
		<ProfileSelector />
	{:else}
		<Navigation />

		<!-- Weather Widget -->
		<WeatherWidget position="bottom-right" size="md" />

		<main>
			{@render children()}
		</main>

		<footer class="border-t border-border bg-muted/50 mt-16">
			<div class="container mx-auto px-4 py-8">
				<div class="flex flex-col md:flex-row items-center justify-between">
					<div class="flex items-center space-x-2 mb-4 md:mb-0">
						<span class="text-2xl">🚀</span>
						<span class="font-semibold text-foreground">Nicolas Paulus</span>
					</div>

					<div
						class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground"
					>
						<p>&copy; 2024 Nicolas Paulus. Tous droits réservés.</p>
						<div class="flex space-x-4">
							<a
								href={page.url.pathname === '/' ? undefined : '/'}
								class="hover:text-foreground transition-colors">Accueil</a
							>
							<a
								href={page.url.pathname === '/contact' ? undefined : '/contact'}
								class="hover:text-foreground transition-colors">Contact</a
							>
						</div>
					</div>
				</div>
			</div>
		</footer>
	{/if}
</div>

<Toaster richColors position="top-right" />
