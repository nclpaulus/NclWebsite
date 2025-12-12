<script lang="ts">
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import type { Column, Card as CardType } from '$lib/types/kanban';
	import CardComponent from './Card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		column: Column;
		cards: CardType[];
		draggable?: boolean;
	}

	let { column, cards, draggable = true }: Props = $props();

	let isDragOver = $state(false);
	let showCreateCardForm = $state(false);
	let newCardTitle = $state('');
	let textareaElement = $state<HTMLTextAreaElement>();

	const columnCards = $derived(
		cards.filter((card) => card.columnId === column.id).sort((a, b) => a.position - b.position)
	);

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!draggable) return;

		isDragOver = true;
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (!draggable) return;

		isDragOver = false;

		const cardId = event.dataTransfer?.getData('cardId');
		const sourceColumnId = event.dataTransfer?.getData('sourceColumnId');

		if (cardId && sourceColumnId && sourceColumnId !== column.id) {
			// Calculate position (add to end of column)
			const targetPosition = columnCards.length;

			const success = await kanbanStore.moveCard({
				cardId,
				targetColumnId: column.id,
				targetPosition
			});

			if (!success) {
				console.error('Failed to move card');
			}
		}
	}

	async function handleCreateCard() {
		if (!newCardTitle.trim()) return;

		const success = await kanbanStore.createCard({
			title: newCardTitle.trim(),
			columnId: column.id
		});

		if (success) {
			newCardTitle = '';
			showCreateCardForm = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showCreateCardForm = false;
			newCardTitle = '';
		}
	}

	$effect(() => {
		if (showCreateCardForm && textareaElement) {
			textareaElement.focus();
		}
	});
</script>

<div
	class="bg-muted/30 rounded-lg p-4 min-w-[300px] max-w-[300px] {isDragOver
		? 'ring-2 ring-primary ring-opacity-50'
		: ''}"
	role="region"
	aria-label="Colonne {column.title}"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<!-- Column Header -->
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-2">
			{#if column.color}
				<div class="w-3 h-3 rounded-full" style="background-color: {column.color}"></div>
			{/if}
			<h3 class="font-semibold text-sm">{column.title}</h3>
			<span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
				{columnCards.length}
			</span>
		</div>

		<div class="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
			<Button variant="ghost" size="sm" class="w-6 h-6 p-0">
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
					/>
				</svg>
			</Button>
		</div>
	</div>

	<!-- Cards Container -->
	<div class="space-y-2 min-h-[100px]">
		{#each columnCards as card (card.id)}
			<CardComponent {card} {draggable} />
		{/each}
	</div>

	<!-- Add Card Button/Form -->
	<div class="mt-4">
		{#if showCreateCardForm}
			<div class="bg-background border border-border rounded-lg p-3">
				<textarea
					bind:value={newCardTitle}
					bind:this={textareaElement}
					placeholder="Saisir un titre pour cette carte..."
					class="w-full resize-none text-sm border-none outline-none bg-transparent"
					rows="3"
					onkeypress={handleKeyPress}
				></textarea>
				<div class="flex gap-2 mt-2">
					<Button size="sm" onclick={handleCreateCard} disabled={!newCardTitle.trim()}>
						Ajouter
					</Button>
					<Button variant="ghost" size="sm" onclick={() => (showCreateCardForm = false)}>
						Annuler
					</Button>
				</div>
			</div>
		{:else}
			<button
				onclick={() => (showCreateCardForm = true)}
				class="w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg p-2 transition-colors flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Ajouter une carte
			</button>
		{/if}
	</div>
</div>
