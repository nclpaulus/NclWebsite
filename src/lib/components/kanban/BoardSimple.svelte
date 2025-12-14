<script lang="ts">
	import { onMount } from 'svelte';
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import { goto } from '$app/navigation';
	import type { Board, Column as ColumnType, Card } from '$lib/types/kanban';
	import { KANBAN_BASE_PATH } from '$lib/demos/kanban';
	import Column from './Column.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	/**
	 * BoardSimple.
	 *
	 * Variante simplifiée de la vue Board (pas de filtres / pas de paramètres).
	 */
	interface Props {
		boardId: string;
	}

	let { boardId }: Props = $props();

	let board = $state<Board | null>(null);
	let columns = $state<ColumnType[]>([]);
	let cards = $state<Card[]>([]);
	let loading = $state(true);

	onMount(async () => {
		await loadBoard();
	});

	async function loadBoard() {
		loading = true;
		kanbanStore.setCurrentBoard(boardId);

		const state = kanbanStore.get();
		board = state.currentBoard;
		columns = state.columns;
		cards = state.cards;
		loading = false;
	}

	const boardCards = $derived(cards.filter((card) => card.boardId === boardId));
	const boardColumns = $derived(
		columns.filter((column) => column.boardId === boardId).sort((a, b) => a.position - b.position)
	);

	function goBack() {
		goto(KANBAN_BASE_PATH);
	}
</script>

<div class="min-h-screen bg-background">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else if !board}
		<div class="flex items-center justify-center py-20">
			<div class="text-center">
				<div class="text-6xl mb-4">📋</div>
				<h3 class="text-xl font-semibold mb-2">Tableau introuvable</h3>
				<p class="text-muted-foreground mb-6">Ce tableau n'existe pas ou vous n'y avez pas accès</p>
				<Button onclick={goBack}>Retour aux tableaux</Button>
			</div>
		</div>
	{:else}
		<div
			class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10"
		>
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<Button variant="ghost" size="sm" onclick={goBack} class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Retour
						</Button>
						<div>
							<h1 class="text-2xl font-bold flex items-center gap-2">
								{board.title}
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
							</h1>
							{#if board.description}
								<p class="text-muted-foreground">{board.description}</p>
							{/if}
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-4 text-sm text-muted-foreground">
							<div class="flex items-center gap-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								{boardCards.length} cartes
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm text-muted-foreground">Membres:</span>
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
					</div>
				</div>
			</div>
		</div>

		<div class="container mx-auto px-4 py-6">
			<div class="flex gap-4 overflow-x-auto pb-6">
				{#each boardColumns as column (column.id)}
					<Column {column} cards={boardCards} />
				{/each}
			</div>
		</div>
	{/if}
</div>
