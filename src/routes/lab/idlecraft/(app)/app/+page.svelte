<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<svelte:head>
	<title>IdleCraft - Dashboard</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
	<Card class="lg:col-span-2">
		<CardContent class="p-6 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">Production</h2>
				<Badge variant="outline">MVP</Badge>
			</div>
			<p class="text-sm text-muted-foreground">
				Cette page affichera les ressources, les taux, et le bouton “Sync offline”.
			</p>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Upgrades</h2>
			<p class="text-sm text-muted-foreground">
				Catalogue d’upgrades (scierie, mine…) et achats via RPC.
			</p>
		</CardContent>
	</Card>

	<Card class="lg:col-span-2">
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Craft</h2>
			<p class="text-sm text-muted-foreground">
				Recettes (planches, haches…) avec prérequis et craft transactionnel.
			</p>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Missions</h2>
			<p class="text-sm text-muted-foreground">
				Start/claim de missions courtes.
			</p>
		</CardContent>
	</Card>
</div>
