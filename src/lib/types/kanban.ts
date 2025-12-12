/** Utilisateur du Kanban (nom, email, avatar). */
export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

/** Commentaire sur une carte (auteur, contenu, dates). */
export interface Comment {
	id: string;
	cardId: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Pièce jointe à une carte (image, document, lien). */
export interface Attachment {
	id: string;
	cardId: string;
	name: string;
	url: string;
	type: 'image' | 'document' | 'link';
	size?: number;
	createdAt: Date;
}

/** Carte du Kanban (titre, description, colonne, labels, assignés...). */
export interface Card {
	id: string;
	title: string;
	description?: string;
	columnId: string;
	boardId: string;
	position: number;
	labels: Label[];
	assignedUsers: User[];
	dueDate?: Date;
	comments: Comment[];
	attachments: Attachment[];
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
}

/** Étiquette colorée pour les cartes. */
export interface Label {
	id: string;
	name: string;
	color: string;
}

/** Colonne du tableau (titre, position, cartes). */
export interface Column {
	id: string;
	title: string;
	boardId: string;
	position: number;
	color?: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Tableau Kanban (colonnes, cartes, membres, permissions). */
export interface Board {
	id: string;
	title: string;
	description?: string;
	columns: Column[];
	cards: Card[];
	members: User[];
	ownerId: string;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/** Filtres appliqués aux cartes d’un tableau. */
export interface BoardFilters {
	search?: string;
	assignedTo?: string[];
	labels?: string[];
	dueDate?: 'overdue' | 'today' | 'week' | 'month' | 'none';
	createdBy?: string;
}

/** État global du store Kanban. */
export interface KanbanState {
	boards: Board[];
	currentBoard: Board | null;
	columns: Column[];
	cards: Card[];
	users: User[];
	labels: Label[];
	loading: boolean;
	error: string | null;
	filters: BoardFilters;
}

/** Requête de création de tableau. */
export interface CreateBoardRequest {
	title: string;
	description?: string;
	isPublic?: boolean;
}

/** Requête de mise à jour de tableau. */
export interface UpdateBoardRequest {
	title?: string;
	description?: string;
	isPublic?: boolean;
}

/** Requête de création de colonne. */
export interface CreateColumnRequest {
	title: string;
	color?: string;
}

/** Requête de mise à jour de colonne. */
export interface UpdateColumnRequest {
	title?: string;
	color?: string;
}

/** Requête de création de carte. */
export interface CreateCardRequest {
	title: string;
	description?: string;
	columnId: string;
	dueDate?: Date;
	labels?: string[];
	assignedUsers?: string[];
}

/** Requête de mise à jour de carte. */
export interface UpdateCardRequest {
	title?: string;
	description?: string;
	columnId?: string;
	position?: number;
	dueDate?: Date;
	labels?: string[];
	assignedUsers?: string[];
}

/** Requête de déplacement de carte entre colonnes. */
export interface MoveCardRequest {
	cardId: string;
	targetColumnId: string;
	targetPosition: number;
}

/** Requête de création de commentaire. */
export interface CreateCommentRequest {
	content: string;
}

/** Requête de mise à jour de commentaire. */
export interface UpdateCommentRequest {
	content: string;
}
