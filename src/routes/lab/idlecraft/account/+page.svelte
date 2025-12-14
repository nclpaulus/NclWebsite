<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>IdleCraft - Compte</title>
</svelte:head>

<div class="container mx-auto px-4 py-10">
	<div class="max-w-xl mx-auto space-y-6">
		<h1 class="text-3xl font-bold">Compte</h1>
		<p class="text-sm text-muted-foreground">
			Connexion / création de compte via email et mot de passe. (OAuth sur la landing)
		</p>

		<Card>
			<CardContent class="p-6 space-y-4">
				<h2 class="text-xl font-semibold">Se connecter</h2>
				<form method="POST" use:enhance action="?/login" class="space-y-3">
					<input
						name="email"
						type="email"
						required
						placeholder="Email"
						class="w-full border rounded-md px-3 py-2 bg-background"
					/>
					<input
						name="password"
						type="password"
						required
						placeholder="Mot de passe"
						class="w-full border rounded-md px-3 py-2 bg-background"
					/>
					<Button type="submit" class="w-full">Connexion</Button>
				</form>
			</CardContent>
		</Card>

		<Card>
			<CardContent class="p-6 space-y-4">
				<h2 class="text-xl font-semibold">Créer un compte</h2>
				<form method="POST" use:enhance action="?/signup" class="space-y-3">
					<input
						name="email"
						type="email"
						required
						placeholder="Email"
						class="w-full border rounded-md px-3 py-2 bg-background"
					/>
					<input
						name="password"
						type="password"
						required
						placeholder="Mot de passe"
						class="w-full border rounded-md px-3 py-2 bg-background"
					/>
					<Button type="submit" class="w-full" variant="secondary">Créer</Button>
				</form>
				<p class="text-xs text-muted-foreground">
					Si la confirmation email est activée dans Supabase, tu devras valider via ton email.
				</p>
			</CardContent>
		</Card>

		<Button variant="ghost" asChild>
			<a href="/lab/idlecraft">Retour</a>
		</Button>
	</div>
</div>
