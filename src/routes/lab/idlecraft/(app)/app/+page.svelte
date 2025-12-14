<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { page } from '$app/state';

	const data = $derived(page.data as unknown as { player: any; inventory: any[]; tick: any });
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
			<div class="text-sm text-muted-foreground space-y-1">
				<div>Gold: <span class="text-foreground font-medium">{data.player.gold}</span></div>
				<div>
					Rates:
					<span class="text-foreground font-medium">{data.player.gold_per_sec}</span> gold/s,
					<span class="text-foreground font-medium">{data.player.wood_per_sec}</span> wood/s,
					<span class="text-foreground font-medium">{data.player.ore_per_sec}</span> ore/s
				</div>
				<div>Last tick: <span class="text-foreground font-medium">{data.player.last_tick_at}</span></div>
			</div>
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

	<Card class="lg:col-span-2">
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Inventaire (debug)</h2>
			{#if data.inventory.length === 0}
				<p class="text-sm text-muted-foreground">Aucun item pour l’instant.</p>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
					{#each data.inventory as row}
						<div class="rounded-md border px-3 py-2">
							<div class="font-medium">{row.item_key}</div>
							<div class="text-muted-foreground">{row.qty}</div>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Tick offline (debug)</h2>
			<pre class="text-xs overflow-auto rounded-md border bg-muted p-3">{JSON.stringify(data.tick, null, 2)}</pre>
		</CardContent>
	</Card>
</div>
