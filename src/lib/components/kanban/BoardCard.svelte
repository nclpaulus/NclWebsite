<script lang="ts">
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import { goto } from '$app/navigation';
	import type { Board } from '$lib/types/kanban';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	/**
	 * BoardCard.
	 *
	 * Carte cliquable représentant un tableau dans la liste (accès + actions rapides).
	 */
	interface Props {
		board: Board;
	}

	let { board }: Props = $props();

	function navigateToBoard() {
		goto(`/kanban/${board.id}`);
	}

	async function handleDeleteBoard() {
		if (confirm(`Êtes-vous sûr de vouloir supprimer le tableau "${board.title}" ?`)) {
			const success = await kanbanStore.deleteBoard(board.id);
			if (success) {
				// Board will be removed from the list automatically
			}
		}
	}
</script>

<div
	class="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
	role="button"
	tabindex="0"
	onclick={navigateToBoard}
	onkeydown={(e) => e.key === 'Enter' && navigateToBoard()}
>
	<div class="flex items-start justify-between mb-4">
		<div
			class="flex-1"
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && navigateToBoard()}
		>
			<h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
				{board.title}
			</h3>
			{#if board.description}
				<p class="text-sm text-muted-foreground line-clamp-2">{board.description}</p>
			{/if}
		</div>
		<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
			{#if board.isPublic}
				<Badge variant="secondary" class="text-xs">
					<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Public
				</Badge>
			{/if}
			<Button
				variant="ghost"
				size="sm"
				onclick={handleDeleteBoard}
				class="text-destructive hover:text-destructive hover:bg-destructive/10"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</Button>
		</div>
	</div>

	<div
		class="space-y-3"
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && navigateToBoard()}
	>
		<!-- Stats -->
		<div class="flex items-center gap-4 text-sm text-muted-foreground">
			<div class="flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
				{board.columns.length} colonnes
			</div>
			<div class="flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
				{board.cards.length} cartes
			</div>
			<div class="flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				{board.members.length} membres
			</div>
		</div>

		<!-- Members -->
		{#if board.members.length > 0}
			<div class="flex items-center gap-2">
				<span class="text-xs text-muted-foreground">Membres:</span>
				<div class="flex -space-x-2">
					{#each board.members.slice(0, 5) as member (member.id)}
						<img
							src={member.avatar ||
								`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
							alt={member.name}
							title={member.name}
							class="w-6 h-6 rounded-full border-2 border-background"
						/>
					{/each}
					{#if board.members.length > 5}
						<div
							class="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
							title="Plus de membres"
						>
							+{board.members.length - 5}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Last Updated -->
		<div class="text-xs text-muted-foreground">
			Mis à jour le {board.updatedAt.toLocaleDateString('fr-FR')}
		</div>
	</div>
</div>
