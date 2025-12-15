<script lang="ts">
	/**
	 * Dashboard principal du jeu IdleCraft
	 * Affiche les ressources, les taux de production et permet les interactions de base
	 */
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Coins from '$lib/components/icons/Coins.svelte';
	import Trees from '$lib/components/icons/Trees.svelte';
	import Gem from '$lib/components/icons/Gem.svelte';
	import RefreshCw from '$lib/components/icons/RefreshCw.svelte';
	import TrendingUp from '$lib/components/icons/TrendingUp.svelte';
	import { fly, slide } from 'svelte/transition';

	/** Données chargées depuis le serveur */
	interface PageDataInterface {
		player: {
			id: string;
			user_id: string;
			display_name: string;
			gold: number;
			gold_per_sec: number;
			wood_per_sec: number;
			ore_per_sec: number;
			last_tick_at: string;
		};
		inventory: { item_key: string; qty: number }[];
		tick: { elapsed_seconds: number; credited_seconds: number };
		upgrades: Array<{
			id: string;
			key: string;
			name: string;
			description: string;
			cost_gold: number;
			owned: boolean;
		}>;
	}

	/** Interfaces pour les réponses des actions du formulaire */
	interface SyncResponse {
		success: boolean;
		tick: PageDataInterface['tick'];
		player: PageDataInterface['player'];
		inventory: PageDataInterface['inventory'];
	}

	interface BuyUpgradeResponse {
		success: boolean;
		result?: {
			upgrade_id?: string;
			player_id?: string;
			[key: string]: unknown;
		};
		player?: PageDataInterface['player'];
		error?: string;
	}

	interface ResetAccountResponse {
		success: boolean;
		deleted?: boolean;
		error?: string;
	}

	let { data }: { data: PageDataInterface } = $props();

	/** État de synchronisation du bouton */
	let syncing = $state(false);

	/** Dernier état de synchronisation pour calculer les gains */
	let lastSyncGold = $state(0);

	/** Gain d'or depuis la dernière synchronisation */
	const goldGained = $derived(data.player.gold - lastSyncGold);

	/** Affiche l'animation de gain pour les petits montants */
	const showGoldAnimation = $derived(goldGained > 0 && goldGained <= 100);
</script>

<svelte:head>
	<title>IdleCraft - Dashboard</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
	<Card class="lg:col-span-2">
		<CardContent class="p-6 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold flex items-center gap-2">
					<TrendingUp class="w-5 h-5 text-primary" />
					Production
				</h2>
				<Badge variant="outline">MVP</Badge>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Gold -->
				<div class="relative">
					<div class="flex items-center gap-2 p-3 rounded-lg border bg-card">
						<Coins class="w-5 h-5 text-yellow-500" />
						<div>
							<div class="text-sm text-muted-foreground">Gold</div>
							<div class="text-lg font-bold">{Number(data.player.gold).toLocaleString()}</div>
							<div class="text-xs text-primary">+{data.player.gold_per_sec} /s</div>
						</div>
					</div>
					{#if showGoldAnimation}
						<div
							class="absolute -top-2 right-4 text-yellow-500 font-bold text-sm"
							in:fly={{ y: 20, duration: 500 }}
							out:fly={{ y: -20, duration: 500 }}
						>
							+{goldGained}
						</div>
					{/if}
				</div>

				<!-- Wood -->
				<div class="flex items-center gap-2 p-3 rounded-lg border bg-card">
					<Trees class="w-5 h-5 text-green-600" />
					<div>
						<div class="text-sm text-muted-foreground">Wood</div>
						<div class="text-lg font-bold">
							{(data.inventory.find((i) => i.item_key === 'wood')?.qty || 0).toLocaleString()}
						</div>
						<div class="text-xs text-primary">+{data.player.wood_per_sec} /s</div>
					</div>
				</div>

				<!-- Ore -->
				<div class="flex items-center gap-2 p-3 rounded-lg border bg-card">
					<Gem class="w-5 h-5 text-gray-600" />
					<div>
						<div class="text-sm text-muted-foreground">Ore</div>
						<div class="text-lg font-bold">
							{(data.inventory.find((i) => i.item_key === 'ore')?.qty || 0).toLocaleString()}
						</div>
						<div class="text-xs text-primary">+{data.player.ore_per_sec} /s</div>
					</div>
				</div>
			</div>

			<div class="pt-2">
				<form
					method="POST"
					action="?/sync"
					use:enhance={() => {
						syncing = true;
						return async ({ result }) => {
							syncing = false;
							if (result.type === 'success' && result.data?.success) {
								const syncData = result.data as unknown as SyncResponse;
								lastSyncGold = syncData.player.gold;
								// Mettre à jour les données de la page avec le nouvel inventaire
								data = {
									player: syncData.player,
									tick: syncData.tick,
									inventory: syncData.inventory,
									upgrades: data.upgrades
								};
							}
						};
					}}
				>
					<Button type="submit" disabled={syncing} class="w-full">
						<RefreshCw class="w-4 h-4 mr-2 {syncing ? 'animate-spin' : ''}" />
						{syncing ? 'Synchronisation...' : 'Sync Offline'}
					</Button>
				</form>
			</div>

			<div class="text-xs text-muted-foreground pt-2 border-t">
				Last tick: {new Date(data.player.last_tick_at).toLocaleString()}
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6 space-y-4">
			<h2 class="text-xl font-semibold flex items-center gap-2">
				<TrendingUp class="w-5 h-5 text-primary" />
				Upgrades
			</h2>

			<div class="space-y-3 max-h-96 overflow-y-auto">
				{#each data.upgrades as upgrade (upgrade.key)}
					<div class="border rounded-lg p-4 space-y-2 {upgrade.owned ? 'bg-muted/50' : ''}">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="font-medium flex items-center gap-2">
									{upgrade.name}
									{#if upgrade.owned}
										<Badge variant="secondary" class="text-xs">Possédé</Badge>
									{/if}
								</h3>
								<p class="text-sm text-muted-foreground">{upgrade.description}</p>

								<div class="text-xs text-muted-foreground mt-1">
									{#if upgrade.cost_gold > 0}
										+{upgrade.cost_gold} gold
									{/if}
								</div>
							</div>

							{#if !upgrade.owned}
								<form
									method="POST"
									action="?/buyUpgrade"
									use:enhance={() => {
										return async ({ result, formData }) => {
											if (result.type === 'success') {
												const response = result.data as unknown as BuyUpgradeResponse;
												if (response.success && response.player) {
													// Mettre à jour les données du joueur et les upgrades
													const upgradeKey = formData.get('upgradeKey') as string;
													data = {
														...data,
														player: response.player,
														upgrades: data.upgrades.map((u) =>
															u.key === upgradeKey ? { ...u, owned: true } : u
														)
													};
												} else {
													alert(`Erreur: ${response.error}`);
												}
											}
										};
									}}
								>
									<input type="hidden" name="upgradeKey" value={upgrade.key} />
									<Button
										type="submit"
										size="sm"
										variant={data.player.gold < upgrade.cost_gold ? 'outline' : 'default'}
									>
										{upgrade.cost_gold}
										<Coins class="w-3 h-3 ml-1" />
									</Button>
								</form>
							{/if}
						</div>
					</div>
				{/each}
			</div>
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
			<p class="text-sm text-muted-foreground">Start/claim de missions courtes.</p>
		</CardContent>
	</Card>

	<Card class="lg:col-span-2">
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold flex items-center gap-2">
				<Trees class="w-5 h-5 text-green-600" />
				Inventaire
			</h2>
			{#if data.inventory.length === 0}
				<p class="text-sm text-muted-foreground">Aucun item pour l'instant.</p>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
					{#each data.inventory as { item_key, qty } (item_key)}
						<div
							class="rounded-lg border p-3 hover:bg-accent transition-colors"
							in:slide={{ duration: 300, delay: item_key.length * 5 }}
						>
							<div class="font-medium capitalize">{item_key.replace('_', ' ')}</div>
							<div class="text-2xl font-bold text-primary">{Number(qty).toLocaleString()}</div>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>

	<Card>
		<CardContent class="p-6 space-y-3">
			<h2 class="text-xl font-semibold">Tick Offline</h2>
			<div class="space-y-2">
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Elapsed:</span>
					<span class="font-medium">{data.tick.elapsed_seconds}s</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Credited:</span>
					<span class="font-medium text-green-600">{data.tick.credited_seconds}s</span>
				</div>
			</div>

			<hr class="my-4" />

			<!-- Test Tools -->
			<div class="space-y-2">
				<!-- Give Gold (test only) -->
				<form
					method="POST"
					action="?/giveGold"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								const response = result.data as {
									success: boolean;
									player: PageDataInterface['player'];
									error?: string;
								};
								if (response.success) {
									// Mettre à jour l'or du joueur
									data = {
										...data,
										player: response.player
									};
								} else {
									alert(`Erreur: ${response.error}`);
								}
							}
						};
					}}
				>
					<input type="hidden" name="amount" value="500" />
					<Button type="submit" variant="secondary" size="sm" class="w-full">
						Donner 500 gold (test)
					</Button>
				</form>

				<!-- Reset Account (test only) -->
				<form
					method="POST"
					action="?/resetAccount"
					use:enhance={() => {
						return async ({ result }) => {
							console.log('Delete result:', result);
							if (result.type === 'success') {
								const response = result.data as unknown as ResetAccountResponse;
								console.log('Delete response:', response);
								if (response.success && response.deleted) {
									// Le compte a été supprimé, recharger la page pour recréer un compte neuf
									alert('Compte supprimé avec succès ! Redirection...');
									window.location.reload();
								} else {
									alert(`Erreur: ${response.error}`);
								}
							}
						};
					}}
				>
					<Button
						type="submit"
						variant="destructive"
						size="sm"
						class="w-full"
						onclick={(e) => {
							if (
								!confirm(
									'Êtes-vous sûr de vouloir réinitialiser votre compte ? Toutes les upgrades et ressources seront perdues !'
								)
							) {
								e.preventDefault();
							}
						}}
					>
						Réinitialiser le compte (test)
					</Button>
				</form>
			</div>
		</CardContent>
	</Card>
</div>
