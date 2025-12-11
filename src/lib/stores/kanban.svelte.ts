import { writable, get as getStoreValue } from 'svelte/store';
import { SvelteDate } from 'svelte/reactivity';
import type {
	Board,
	Column,
	Card,
	User,
	Label,
	Comment,
	KanbanState,
	BoardFilters,
	CreateBoardRequest,
	UpdateBoardRequest,
	CreateColumnRequest,
	UpdateColumnRequest,
	CreateCardRequest,
	UpdateCardRequest,
	MoveCardRequest,
	CreateCommentRequest,
	UpdateCommentRequest
} from '$lib/types/kanban';

interface KanbanStore {
	subscribe: (cb: (value: KanbanState) => void) => () => void;
	initializeBoards: () => void;
	createBoard: (request: CreateBoardRequest) => Promise<boolean>;
	updateBoard: (id: string, request: UpdateBoardRequest) => Promise<boolean>;
	deleteBoard: (id: string) => Promise<boolean>;
	setCurrentBoard: (id: string) => void;
	createColumn: (boardId: string, request: CreateColumnRequest) => Promise<boolean>;
	updateColumn: (id: string, request: UpdateColumnRequest) => Promise<boolean>;
	deleteColumn: (id: string) => Promise<boolean>;
	createCard: (request: CreateCardRequest) => Promise<boolean>;
	updateCard: (id: string, request: UpdateCardRequest) => Promise<boolean>;
	deleteCard: (id: string) => Promise<boolean>;
	moveCard: (request: MoveCardRequest) => Promise<boolean>;
	addComment: (cardId: string, request: CreateCommentRequest) => Promise<boolean>;
	updateComment: (
		cardId: string,
		commentId: string,
		request: UpdateCommentRequest
	) => Promise<boolean>;
	deleteComment: (cardId: string, commentId: string) => Promise<boolean>;
	filterCards: (filters: BoardFilters) => void;
	getBoardById: (id: string) => Board | null;
	getColumnById: (id: string) => Column | null;
	getCardById: (id: string) => Card | null;
	getUserById: (id: string) => User | null;
	getFilteredCards: () => Card[];
	get: () => KanbanState;
}

const initialState: KanbanState = {
	boards: [],
	currentBoard: null,
	columns: [],
	cards: [],
	users: [],
	labels: [],
	loading: false,
	error: null,
	filters: {}
};

// Mock data for demonstration
const mockUsers: User[] = [
	{
		id: '1',
		name: 'Jean Dupont',
		email: 'jean.dupont@example.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean'
	},
	{
		id: '2',
		name: 'Marie Martin',
		email: 'marie.martin@example.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie'
	},
	{
		id: '3',
		name: 'Pierre Durand',
		email: 'pierre.durand@example.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre'
	}
];

const mockLabels: Label[] = [
	{ id: '1', name: 'Urgent', color: '#ef4444' },
	{ id: '2', name: 'Bug', color: '#f59e0b' },
	{ id: '3', name: 'Feature', color: '#10b981' },
	{ id: '4', name: 'Documentation', color: '#3b82f6' },
	{ id: '5', name: 'Review', color: '#8b5cf6' }
];

function createKanbanStore(): KanbanStore {
	const { subscribe, update } = writable<KanbanState>(initialState);

	// Initialize with mock data
	function initializeBoards() {
		update((state) => ({
			...state,
			users: mockUsers,
			labels: mockLabels,
			boards: generateMockBoards(),
			loading: false
		}));
	}

	// Generate mock boards
	function generateMockBoards(): Board[] {
		const mockBoard: Board = {
			id: '1',
			title: 'Projet Web Application',
			description: "Développement d'une application web collaborative avec Kanban board",
			columns: generateMockColumns(),
			cards: generateMockCards(),
			members: mockUsers,
			ownerId: '1',
			isPublic: false,
			createdAt: new SvelteDate('2024-01-01'),
			updatedAt: new SvelteDate('2024-12-01')
		};

		return [mockBoard];
	}

	// Generate mock columns
	function generateMockColumns(): Column[] {
		return [
			{
				id: '1',
				title: 'À faire',
				boardId: '1',
				position: 0,
				color: '#6b7280',
				createdAt: new SvelteDate('2024-01-01'),
				updatedAt: new SvelteDate('2024-01-01')
			},
			{
				id: '2',
				title: 'En cours',
				boardId: '1',
				position: 1,
				color: '#3b82f6',
				createdAt: new SvelteDate('2024-01-01'),
				updatedAt: new SvelteDate('2024-01-01')
			},
			{
				id: '3',
				title: 'En revue',
				boardId: '1',
				position: 2,
				color: '#f59e0b',
				createdAt: new SvelteDate('2024-01-01'),
				updatedAt: new SvelteDate('2024-01-01')
			},
			{
				id: '4',
				title: 'Terminé',
				boardId: '1',
				position: 3,
				color: '#10b981',
				createdAt: new SvelteDate('2024-01-01'),
				updatedAt: new SvelteDate('2024-01-01')
			}
		];
	}

	// Generate mock cards
	function generateMockCards(): Card[] {
		return [
			{
				id: '1',
				title: "Créer l'interface d'authentification",
				description: 'Implémenter le login/logout avec JWT et gestion des sessions',
				columnId: '1',
				boardId: '1',
				position: 0,
				labels: [mockLabels[0], mockLabels[2]],
				assignedUsers: [mockUsers[0]],
				dueDate: new SvelteDate('2024-12-15'),
				comments: [],
				attachments: [],
				createdAt: new SvelteDate('2024-12-01'),
				updatedAt: new SvelteDate('2024-12-01'),
				createdBy: '1'
			},
			{
				id: '2',
				title: 'Développer le drag & drop',
				description: 'Permettre le déplacement des cartes entre colonnes',
				columnId: '2',
				boardId: '1',
				position: 0,
				labels: [mockLabels[2]],
				assignedUsers: [mockUsers[1]],
				dueDate: new SvelteDate('2024-12-10'),
				comments: [],
				attachments: [],
				createdAt: new SvelteDate('2024-12-02'),
				updatedAt: new SvelteDate('2024-12-05'),
				createdBy: '2'
			},
			{
				id: '3',
				title: 'Corriger le bug de pagination',
				description: 'La pagination ne fonctionne pas correctement sur mobile',
				columnId: '1',
				boardId: '1',
				position: 1,
				labels: [mockLabels[0], mockLabels[1]],
				assignedUsers: [mockUsers[2]],
				dueDate: new SvelteDate('2024-12-08'),
				comments: [],
				attachments: [],
				createdAt: new SvelteDate('2024-12-03'),
				updatedAt: new SvelteDate('2024-12-03'),
				createdBy: '3'
			},
			{
				id: '4',
				title: 'Optimiser les performances',
				description: 'Réduire le temps de chargement des tableaux',
				columnId: '3',
				boardId: '1',
				position: 0,
				labels: [mockLabels[4]],
				assignedUsers: [mockUsers[0], mockUsers[1]],
				comments: [],
				attachments: [],
				createdAt: new SvelteDate('2024-12-04'),
				updatedAt: new SvelteDate('2024-12-06'),
				createdBy: '1'
			}
		];
	}

	// Create board
	async function createBoard(request: CreateBoardRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newBoard: Board = {
				id: Date.now().toString(),
				...request,
				columns: [],
				cards: [],
				members: [mockUsers[0]], // Add current user as member
				ownerId: '1',
				createdAt: new SvelteDate(),
				updatedAt: new SvelteDate(),
				isPublic: request.isPublic ?? false
			};

			update((state) => ({
				...state,
				boards: [...state.boards, newBoard],
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création du tableau',
				loading: false
			}));
			return false;
		}
	}

	// Update board
	async function updateBoard(id: string, request: UpdateBoardRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				boards: state.boards.map((board) =>
					board.id === id ? { ...board, ...request, updatedAt: new SvelteDate() } : board
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				loading: false
			}));
			return false;
		}
	}

	// Delete board
	async function deleteBoard(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				boards: state.boards.filter((board) => board.id !== id),
				currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				loading: false
			}));
			return false;
		}
	}

	// Set current board
	function setCurrentBoard(id: string) {
		update((state) => {
			const board = state.boards.find((b) => b.id === id);
			const columns = board?.columns || [];
			const cards = board?.cards || [];

			return {
				...state,
				currentBoard: board || null,
				columns,
				cards
			};
		});
	}

	// Create column
	async function createColumn(boardId: string, request: CreateColumnRequest): Promise<boolean> {
		let currentState: KanbanState | undefined;

		update((state) => {
			currentState = state;
			return { ...state, loading: true, error: null };
		});

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const newColumn: Column = {
				id: Date.now().toString(),
				...request,
				boardId,
				position: currentState?.columns.length || 0,
				createdAt: new SvelteDate(),
				updatedAt: new SvelteDate()
			};

			update((state) => ({
				...state,
				columns: [...state.columns, newColumn],
				boards: state.boards.map((board) =>
					board.id === boardId ? { ...board, columns: [...board.columns, newColumn] } : board
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création de la colonne',
				loading: false
			}));
			return false;
		}
	}

	// Update column
	async function updateColumn(id: string, request: UpdateColumnRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				columns: state.columns.map((column) =>
					column.id === id ? { ...column, ...request, updatedAt: new SvelteDate() } : column
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				loading: false
			}));
			return false;
		}
	}

	// Delete column
	async function deleteColumn(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				columns: state.columns.filter((column) => column.id !== id),
				cards: state.cards.filter((card) => card.columnId !== id),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				loading: false
			}));
			return false;
		}
	}

	// Create card
	async function createCard(request: CreateCardRequest): Promise<boolean> {
		let currentBoardId: string;

		update((state) => {
			currentBoardId = state.currentBoard?.id || '1';
			return { ...state, loading: true, error: null };
		});

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => {
				const newCard: Card = {
					id: Date.now().toString(),
					...request,
					boardId: currentBoardId,
					position: state.cards.filter((c) => c.columnId === request.columnId).length,
					labels:
						request.labels?.map((id) => mockLabels.find((l) => l.id === id)!).filter(Boolean) || [],
					assignedUsers:
						request.assignedUsers
							?.map((id) => mockUsers.find((u) => u.id === id)!)
							.filter(Boolean) || [],
					comments: [],
					attachments: [],
					createdAt: new SvelteDate(),
					updatedAt: new SvelteDate(),
					createdBy: '1'
				};

				return {
					...state,
					cards: [...state.cards, newCard],
					loading: false
				};
			});

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création de la carte',
				loading: false
			}));
			return false;
		}
	}

	// Update card
	async function updateCard(id: string, request: UpdateCardRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				cards: state.cards.map((card) =>
					card.id === id
						? {
								...card,
								...request,
								labels:
									request.labels
										?.map((id) => mockLabels.find((l) => l.id === id)!)
										.filter(Boolean) || card.labels,
								assignedUsers:
									request.assignedUsers
										?.map((id) => mockUsers.find((u) => u.id === id)!)
										.filter(Boolean) || card.assignedUsers,
								updatedAt: new SvelteDate()
							}
						: card
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				loading: false
			}));
			return false;
		}
	}

	// Delete card
	async function deleteCard(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			update((state) => ({
				...state,
				cards: state.cards.filter((card) => card.id !== id),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				loading: false
			}));
			return false;
		}
	}

	// Move card
	async function moveCard(request: MoveCardRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			update((state) => {
				const updatedCards = state.cards.map((card) => {
					if (card.id === request.cardId) {
						return {
							...card,
							columnId: request.targetColumnId,
							position: request.targetPosition,
							updatedAt: new SvelteDate()
						};
					}
					return card;
				});

				// Reorder cards in the target column
				const targetColumnCards = updatedCards
					.filter((c) => c.columnId === request.targetColumnId)
					.sort((a, b) => a.position - b.position);

				targetColumnCards.forEach((card, index) => {
					if (card.id !== request.cardId && index >= request.targetPosition) {
						const cardIndex = updatedCards.findIndex((c) => c.id === card.id);
						updatedCards[cardIndex] = { ...card, position: index + 1 };
					}
				});

				return {
					...state,
					cards: updatedCards,
					loading: false
				};
			});

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors du déplacement',
				loading: false
			}));
			return false;
		}
	}

	// Add comment
	async function addComment(cardId: string, request: CreateCommentRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			const newComment: Comment = {
				id: Date.now().toString(),
				cardId,
				userId: '1',
				content: request.content,
				createdAt: new SvelteDate(),
				updatedAt: new SvelteDate()
			};

			update((state) => ({
				...state,
				cards: state.cards.map((card) =>
					card.id === cardId ? { ...card, comments: [...card.comments, newComment] } : card
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : "Erreur lors de l'ajout du commentaire",
				loading: false
			}));
			return false;
		}
	}

	// Update comment
	async function updateComment(
		cardId: string,
		commentId: string,
		request: UpdateCommentRequest
	): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			update((state) => ({
				...state,
				cards: state.cards.map((card) =>
					card.id === cardId
						? {
								...card,
								comments: card.comments.map((comment) =>
									comment.id === commentId
										? { ...comment, content: request.content, updatedAt: new SvelteDate() }
										: comment
								)
							}
						: card
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				loading: false
			}));
			return false;
		}
	}

	// Delete comment
	async function deleteComment(cardId: string, commentId: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			update((state) => ({
				...state,
				cards: state.cards.map((card) =>
					card.id === cardId
						? { ...card, comments: card.comments.filter((comment) => comment.id !== commentId) }
						: card
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				loading: false
			}));
			return false;
		}
	}

	// Filter cards
	function filterCards(filters: BoardFilters) {
		update((state) => ({ ...state, filters }));
	}

	// Get filtered cards
	function getFilteredCards(): Card[] {
		const state = getStoreValue(kanbanStore);
		let filtered = state.cards;

		if (state.filters.search) {
			filtered = filtered.filter(
				(card) =>
					card.title.toLowerCase().includes(state.filters.search!.toLowerCase()) ||
					card.description?.toLowerCase().includes(state.filters.search!.toLowerCase())
			);
		}

		if (state.filters.assignedTo && state.filters.assignedTo.length > 0) {
			filtered = filtered.filter((card) =>
				card.assignedUsers.some((user) => state.filters.assignedTo!.includes(user.id))
			);
		}

		if (state.filters.labels && state.filters.labels.length > 0) {
			filtered = filtered.filter((card) =>
				card.labels.some((label) => state.filters.labels!.includes(label.id))
			);
		}

		if (state.filters.dueDate) {
			const today = new Date();
			filtered = filtered.filter((card) => {
				if (!card.dueDate) return state.filters.dueDate === 'none';

				const dueDate = new Date(card.dueDate);
				const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

				switch (state.filters.dueDate) {
					case 'overdue':
						return diffDays < 0;
					case 'today':
						return diffDays === 0;
					case 'week':
						return diffDays <= 7 && diffDays >= 0;
					case 'month':
						return diffDays <= 30 && diffDays >= 0;
					case 'none':
						return false;
					default:
						return true;
				}
			});
		}

		return filtered;
	}

	// Helper functions
	function getBoardById(id: string): Board | null {
		const state = getStoreValue(kanbanStore);
		return state.boards.find((board) => board.id === id) || null;
	}

	function getColumnById(id: string): Column | null {
		const state = getStoreValue(kanbanStore);
		return state.columns.find((column) => column.id === id) || null;
	}

	function getCardById(id: string): Card | null {
		const state = getStoreValue(kanbanStore);
		return state.cards.find((card) => card.id === id) || null;
	}

	function getUserById(id: string): User | null {
		const state = getStoreValue(kanbanStore);
		return state.users.find((user) => user.id === id) || null;
	}

	return {
		subscribe,
		initializeBoards,
		createBoard,
		updateBoard,
		deleteBoard,
		setCurrentBoard,
		createColumn,
		updateColumn,
		deleteColumn,
		createCard,
		updateCard,
		deleteCard,
		moveCard,
		addComment,
		updateComment,
		deleteComment,
		filterCards,
		getBoardById,
		getColumnById,
		getCardById,
		getUserById,
		getFilteredCards,
		get: () => getStoreValue(kanbanStore)
	};
}

export const kanbanStore = createKanbanStore();
