<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { profile, hasProfile } from '$lib/stores/profile';
	import Navigation from '$lib/components/Navigation.svelte';
	import ProfileSelector from '$lib/components/ProfileSelector.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

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
	<title>NPaulusWebsite</title>
	<meta name="description" content="Site web personnel - Portfolio, Gaming, Blog et Contact" />
</svelte:head>

<div class="min-h-screen bg-background profile-transition">
	{#if isInitializing}
		<!-- Loading skeleton pendant l'initialisation -->
		<div class="flex items-center justify-center min-h-screen">
			<div class="flex flex-col items-center space-y-4">
				<div class="w-16 h-16 bg-primary rounded-full animate-pulse"></div>
				<div class="text-muted-foreground">Chargement de votre profil...</div>
			</div>
		</div>
	{:else if showProfileSelector}
		<ProfileSelector />
	{:else}
		<Navigation />

		<main>
			{@render children()}
		</main>

		<footer class="border-t border-border bg-muted/50 mt-16">
			<div class="container mx-auto px-4 py-8">
				<div class="flex flex-col md:flex-row items-center justify-between">
					<div class="flex items-center space-x-2 mb-4 md:mb-0">
						<span class="text-2xl">🚀</span>
						<span class="font-semibold text-foreground">NPaulusWebsite</span>
					</div>

					<div
						class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground"
					>
						<p>&copy; 2024 NPaulusWebsite. Tous droits réservés.</p>
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
