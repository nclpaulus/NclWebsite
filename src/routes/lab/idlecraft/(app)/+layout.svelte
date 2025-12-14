<script lang="ts">
	import { type Snippet } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { page } from '$app/state';

	const pathname = $derived(page.url.pathname);
	const { children }: { children: Snippet } = $props();
</script>

<div class="container mx-auto px-4 py-6">
	<div class="max-w-5xl mx-auto space-y-6">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold">IdleCraft</h1>
					<Badge variant="secondary">Beta</Badge>
				</div>
				<p class="text-sm text-muted-foreground">App protégée (session requise)</p>
			</div>

			<form method="POST" action="/lab/idlecraft/auth/signout">
				<Button variant="outline" type="submit">Se déconnecter</Button>
			</form>
		</div>

		<nav class="flex flex-wrap gap-2">
			<Button variant={pathname.endsWith('/app') ? 'default' : 'outline'} asChild>
				<a href="/lab/idlecraft/app">Dashboard</a>
			</Button>
			<Button variant={pathname.endsWith('/market') ? 'default' : 'outline'} asChild>
				<a href="/lab/idlecraft/market">Marché</a>
			</Button>
			<Button variant={pathname.endsWith('/leaderboard') ? 'default' : 'outline'} asChild>
				<a href="/lab/idlecraft/leaderboard">Leaderboard</a>
			</Button>
		</nav>

		{@render children()}
	</div>
</div>
