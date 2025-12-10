<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { cn } from '$lib/utils';

	interface NavItem {
		href: string;
		label: string;
		icon?: string;
	}

	const navItems: NavItem[] = [
		{ href: '/', label: 'Accueil', icon: '🏠' },
		{ href: '/portfolio', label: 'Portfolio', icon: '💼' },
		{ href: '/gaming', label: 'Gaming', icon: '🎮' },
		{ href: '/blog', label: 'Blog', icon: '📝' },
		{ href: '/contact', label: 'Contact', icon: '📧' }
	];

	$: currentPath = $page.url.pathname;

	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
</script>

<nav class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a 
				href="/" 
				class="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
			>
				<span class="text-2xl">🚀</span>
				<span>NP</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-6">
				{#each navItems as item}
					<a
						href={item.href}
						class={cn(
							"flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
							isActive(item.href)
								? "text-primary bg-primary/10"
								: "text-muted-foreground hover:text-foreground hover:bg-accent"
						)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{#if item.icon}
							<span class="text-base">{item.icon}</span>
						{/if}
						<span>{item.label}</span>
					</a>
				{/each}
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<Button
					variant="ghost"
					size="icon"
					class="text-muted-foreground hover:text-foreground"
					aria-label="Menu"
					onclick={() => {
						// TODO: Implement mobile menu toggle
					}}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</Button>
			</div>
		</div>

		<!-- Mobile Navigation (hidden by default) -->
		<div class="md:hidden border-t border-border">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class={cn(
							"flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors",
							isActive(item.href)
								? "text-primary bg-primary/10"
								: "text-muted-foreground hover:text-foreground hover:bg-accent"
						)}
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{#if item.icon}
							<span class="text-base">{item.icon}</span>
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
