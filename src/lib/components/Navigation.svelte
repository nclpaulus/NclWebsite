<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
	import ProfileSwitcher from '$lib/components/ProfileSwitcher.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { cn } from '$lib/utils';
	import { profile } from '$lib/stores/profile';

	// Menus spécifiques par profil
	const profileNavItems = {
		pro: [
			{ href: '/', label: 'Accueil', icon: '🏠' },
			{ href: '/lab', label: 'Lab', icon: '🧪' },
			{ href: '/projects', label: 'Projets', icon: '🚀' },
			{ href: '/contact', label: 'Contact', icon: '📧' }
		],
		gamer: [
			{ href: '/', label: 'Accueil', icon: '🏠' },
			{ href: '/gaming', label: 'Gaming', icon: '🎮' },
			{ href: '/gaming/discovery', label: 'Découverte', icon: '🔍' },
			{ href: '/gaming/pokemon', label: 'Pokémon', icon: '⚡' },
			{ href: '/contact', label: 'Contact', icon: '📧' }
		],
		lambda: [
			{ href: '/', label: 'Accueil', icon: '🏠' },
			{ href: '/about', label: 'À propos', icon: '👋' },
			{ href: '/contact', label: 'Contact', icon: '📧' }
		]
	};

	// Navigation réactive selon le profil
	const navItems = $derived($profile ? profileNavItems[$profile] : profileNavItems.lambda);

	const currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
</script>

<nav
	class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50"
>
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<Logo
				size="md"
				withText={true}
				href={page.url.pathname === '/' ? undefined : '/'}
				fetchPriority="high"
				ariaCurrent={isActive('/') ? 'page' : undefined}
			/>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-6">
				{#each navItems as item (item.href)}
					<a
						href={page.url.pathname === item.href ? undefined : item.href}
						class={cn(
							'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
							isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
						)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{#if item.icon}
							<span>{item.icon}</span>
						{/if}
						<span>{item.label}</span>
					</a>
				{/each}
			</div>

			<!-- Right side: Profile Switcher + Mobile Menu -->
			<div class="flex items-center space-x-4">
				<!-- Profile Switcher -->
				<ProfileSwitcher />

				<!-- Mobile Menu Button -->
				<Button variant="ghost" size="icon" class="md:hidden" aria-label="Menu">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</Button>
			</div>
		</div>

		<!-- Mobile Navigation (hidden for now) -->
		<div class="md:hidden border-t border-border">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#each navItems as item (item.href)}
					<a
						href={page.url.pathname === item.href ? undefined : item.href}
						class={cn(
							'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors',
							isActive(item.href)
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
						)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{#if item.icon}
							<span>{item.icon}</span>
						{/if}
						<span>{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	/* Sticky navigation with backdrop blur */
	nav {
		backdrop-filter: blur(8px);
	}
</style>
