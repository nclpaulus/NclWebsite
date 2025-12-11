<script lang="ts">
	import { profile, profileInfo } from '$lib/stores/profile';
	import type { Profile } from '$lib/services/profileDB';
	import { profileDB } from '$lib/services/profileDB';
	import Button from '$lib/components/ui/button.svelte';

	let isOpen = $state(false);

	const profiles = [
		{ id: 'pro' as Profile, ...profileInfo.pro },
		{ id: 'gamer' as Profile, ...profileInfo.gamer },
		{ id: 'lambda' as Profile, ...profileInfo.lambda }
	];

	async function switchProfile(newProfile: Profile) {
		await profile.switch(newProfile);
		isOpen = false;
		// Redirection vers la page d'accueil après changement de profil
		window.location.href = '/';
	}

	async function clearIndexedDB() {
		try {
			await profileDB.clearSettings();
			console.log('IndexedDB nettoyée avec succès');
			// Optionnel: recharger la page pour réinitialiser l'état
			window.location.reload();
		} catch (error) {
			console.error('Erreur lors du nettoyage de IndexedDB:', error);
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Fermer le dropdown si clic extérieur (optimisé)
	function handleClickOutside(event: MouseEvent) {
		if (!isOpen) return;
		if (!event.target || !(event.target as Element).closest('.profile-switcher')) {
			isOpen = false;
		}
	}

	// Navigation clavier complète
	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return;

		switch (event.key) {
			case 'Escape':
				isOpen = false;
				break;
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				// Focus navigation simplifiée
				const menuItems = document.querySelectorAll('[role="menuitem"]');
				const currentIndex = Array.from(menuItems).indexOf(document.activeElement as Element);
				const nextIndex =
					event.key === 'ArrowDown'
						? Math.min(currentIndex + 1, menuItems.length - 1)
						: Math.max(currentIndex - 1, 0);
				(menuItems[nextIndex] as HTMLElement)?.focus();
				break;
			}
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="profile-switcher relative">
	<!-- Bouton principal -->
	<Button
		variant="ghost"
		size="sm"
		class="flex items-center space-x-2 px-3 py-2"
		onclick={toggleDropdown}
		aria-expanded={isOpen}
		aria-haspopup="menu"
		role="button"
		tabindex={0}
	>
		<span class="text-lg">
			{#if $profile}
				{profileInfo[$profile].icon}
			{:else}
				👤
			{/if}
		</span>
		<span class="text-sm hidden md:inline">
			{#if $profile}
				{profileInfo[$profile].name}
			{:else}
				Profil
			{/if}
		</span>
		<span class="text-xs {isOpen ? 'rotate-180' : ''} transition-transform"> ▼ </span>
	</Button>

	<!-- Dropdown -->
	{#if isOpen}
		<div
			class="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50"
			role="menu"
		>
			<div class="p-2">
				<div class="px-3 py-2 text-sm font-medium text-muted-foreground mb-2" role="none">
					Changer de profil
				</div>

				{#each profiles as p (p.id)}
					<button
						class="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left {$profile ===
						p.id
							? 'bg-accent'
							: ''}"
						onclick={() => switchProfile(p.id)}
						disabled={$profile === p.id}
						role="menuitem"
						tabindex={-1}
					>
						<span class="text-xl">{p.icon}</span>
						<div class="flex-1">
							<div class="font-medium text-foreground">
								{p.name}
							</div>
							<div class="text-xs text-muted-foreground">
								{p.description}
							</div>
						</div>
						{#if $profile === p.id}
							<div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
								<span class="text-xs text-primary-foreground">✓</span>
							</div>
						{/if}
					</button>
				{/each}

				<div class="border-t border-border mt-2 pt-2">
					<!-- Bouton de nettoyage IndexedDB (développement) -->
					<button
						class="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors text-left text-sm text-destructive"
						onclick={clearIndexedDB}
						role="menuitem"
						tabindex="-1"
					>
						<span>🗑️</span>
						<span>Nettoyer IndexedDB</span>
					</button>

					<button
						class="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left text-sm text-muted-foreground"
						onclick={() => (isOpen = false)}
						role="menuitem"
						tabindex="-1"
					>
						<span>✖</span>
						<span>Annuler</span>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
