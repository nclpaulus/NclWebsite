<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>IdleCraft - Leaderboard</title>
</svelte:head>

<Card>
	<CardContent class="p-6 space-y-3">
		<h2 class="text-xl font-semibold">Leaderboard</h2>
		<p class="text-sm text-muted-foreground">Top joueurs (basé sur `players.gold`).</p>
	</CardContent>
</Card>
