/** Exemples de code documenté pour la page architecture. */

export const storeExample = `/** Store Kanban avec persistence IndexedDB et gestion des états. */
export function createKanbanStore(): KanbanStore {
	const { subscribe, update } = writable&lt;KanbanState&gt;(initialState);

	/** Crée un nouveau tableau et le persiste. */
	async function createBoard(request: CreateBoardRequest): Promise&lt;boolean&gt; {
		// Implementation...
	}

	/** Déplace une carte entre colonnes avec mise à jour optimiste. */
	async function moveCard(request: MoveCardRequest): Promise&lt;boolean&gt; {
		// Implementation...
	}

	return { subscribe, createBoard, moveCard };
}`;

export const interfaceExample = `/** Tableau Kanban avec colonnes, cartes et permissions. */
export interface Board {
	id: string;
	title: string;
	/** Description optionnelle du tableau */
	description?: string;
	columns: Column[];
	members: User[];
	permissions: BoardPermission;
	createdAt: Date;
	updatedAt: Date;
}

/** Requête de création de tableau avec validation. */
export interface CreateBoardRequest {
	title: string;
	description?: string;
	isPublic?: boolean;
}`;
