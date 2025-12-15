<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';

	let loadingProvider: 'google' | 'discord' | null = null;

	async function signInWith(provider: 'google' | 'discord') {
		loadingProvider = provider;
		const supabase = createSupabaseBrowserClient();

		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/lab/idlecraft/auth/callback`
			}
		});
	}
</script>

<svelte:head>
	<title>IdleCraft - Lab - NPaulusWebsite</title>
	<meta
		name="description"
		content="IdleCraft: mini-jeu idle avec auth Supabase, persistance, RLS et RPC"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-10">
	<div class="max-w-4xl mx-auto space-y-8">
		<div class="text-center space-y-3">
			<h1 class="text-4xl md:text-5xl font-bold">IdleCraft</h1>
			<p class="text-muted-foreground">
				Démo "idle + sessions courtes" centrée sur l’authentification et la persistance des données.
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				<Badge variant="secondary">Supabase Auth</Badge>
				<Badge variant="secondary">RLS</Badge>
				<Badge variant="secondary">RPC</Badge>
				<Badge variant="outline">SvelteKit</Badge>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				<CardContent class="p-6 space-y-4">
					<h2 class="text-xl font-semibold">Connexion</h2>
					<div class="space-y-2">
						<Button
							class="w-full"
							onclick={() => signInWith('google')}
							disabled={loadingProvider !== null}
						>
							{loadingProvider === 'google' ? 'Redirection…' : 'Continuer avec Google'}
						</Button>
						<Button
							class="w-full"
							variant="secondary"
							onclick={() => signInWith('discord')}
							disabled={loadingProvider !== null}
						>
							{loadingProvider === 'discord' ? 'Redirection…' : 'Continuer avec Discord'}
						</Button>
						<Button class="w-full" variant="outline" asChild>
							<a href="/lab/idlecraft/account">Email / mot de passe</a>
						</Button>
					</div>
					<p class="text-xs text-muted-foreground">
						Après la connexion, tu seras redirigé vers l’application IdleCraft.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="p-6 space-y-4">
					<h2 class="text-xl font-semibold">Ce que tu vas voir</h2>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>Tick offline capé à 12h</li>
						<li>Inventaire générique (items stackables)</li>
						<li>Marché et leaderboard</li>
						<li>RLS + RPC (transactions)</li>
					</ul>
					<Button variant="ghost" asChild>
						<a href="/lab">Retour au Lab</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
