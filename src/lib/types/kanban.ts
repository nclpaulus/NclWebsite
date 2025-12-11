export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export interface Comment {
	id: string;
	cardId: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Attachment {
	id: string;
	cardId: string;
	name: string;
	url: string;
	type: 'image' | 'document' | 'link';
	size?: number;
	createdAt: Date;
}

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

export interface Label {
	id: string;
	name: string;
	color: string;
}

export interface Column {
	id: string;
	title: string;
	boardId: string;
	position: number;
	color?: string;
	createdAt: Date;
	updatedAt: Date;
}

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

export interface BoardFilters {
	search?: string;
	assignedTo?: string[];
	labels?: string[];
	dueDate?: 'overdue' | 'today' | 'week' | 'month' | 'none';
	createdBy?: string;
}

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

export interface CreateBoardRequest {
	title: string;
	description?: string;
	isPublic?: boolean;
}

export interface UpdateBoardRequest {
	title?: string;
	description?: string;
	isPublic?: boolean;
}

export interface CreateColumnRequest {
	title: string;
	color?: string;
}

export interface UpdateColumnRequest {
	title?: string;
	color?: string;
}

export interface CreateCardRequest {
	title: string;
	description?: string;
	columnId: string;
	dueDate?: Date;
	labels?: string[];
	assignedUsers?: string[];
}

export interface UpdateCardRequest {
	title?: string;
	description?: string;
	columnId?: string;
	position?: number;
	dueDate?: Date;
	labels?: string[];
	assignedUsers?: string[];
}

export interface MoveCardRequest {
	cardId: string;
	targetColumnId: string;
	targetPosition: number;
}

export interface CreateCommentRequest {
	content: string;
}

export interface UpdateCommentRequest {
	content: string;
}
