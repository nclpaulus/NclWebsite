import type { Board, Card, Column, Label, User } from '$lib/types/kanban';

/**
 * Données mock Kanban.
 *
 * Utilisées comme fallback en développement lorsque l'IndexedDB est vide/non disponible.
 */

/** Données mock (démo). */
export const mockUsers: User[] = [
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

/** Données mock (démo). */
export const mockLabels: Label[] = [
	{ id: '1', name: 'Urgent', color: '#ef4444' },
	{ id: '2', name: 'Bug', color: '#f59e0b' },
	{ id: '3', name: 'Feature', color: '#10b981' },
	{ id: '4', name: 'Documentation', color: '#3b82f6' },
	{ id: '5', name: 'Review', color: '#8b5cf6' }
];

/** Génère une liste de boards de démo. */
export function generateMockBoards(): Board[] {
	const mockBoard: Board = {
		id: '1',
		title: 'Projet Web Application',
		description: "Développement d'une application web collaborative avec Kanban board",
		columns: generateMockColumns(),
		cards: generateMockCards(),
		members: mockUsers,
		ownerId: '1',
		isPublic: false,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-12-01T00:00:00.000Z')
	};

	return [mockBoard];
}

/** Génère les colonnes de démo. */
export function generateMockColumns(): Column[] {
	return [
		{
			id: '1',
			title: 'À faire',
			boardId: '1',
			position: 0,
			color: '#6b7280',
			createdAt: new Date('2024-01-01T00:00:00.000Z'),
			updatedAt: new Date('2024-01-01T00:00:00.000Z')
		},
		{
			id: '2',
			title: 'En cours',
			boardId: '1',
			position: 1,
			color: '#3b82f6',
			createdAt: new Date('2024-01-01T00:00:00.000Z'),
			updatedAt: new Date('2024-01-01T00:00:00.000Z')
		},
		{
			id: '3',
			title: 'En revue',
			boardId: '1',
			position: 2,
			color: '#f59e0b',
			createdAt: new Date('2024-01-01T00:00:00.000Z'),
			updatedAt: new Date('2024-01-01T00:00:00.000Z')
		},
		{
			id: '4',
			title: 'Terminé',
			boardId: '1',
			position: 3,
			color: '#10b981',
			createdAt: new Date('2024-01-01T00:00:00.000Z'),
			updatedAt: new Date('2024-01-01T00:00:00.000Z')
		}
	];
}

/** Génère les cartes de démo. */
export function generateMockCards(): Card[] {
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
			dueDate: new Date('2024-12-15T00:00:00.000Z'),
			comments: [],
			attachments: [],
			createdAt: new Date('2024-12-01T00:00:00.000Z'),
			updatedAt: new Date('2024-12-01T00:00:00.000Z'),
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
			dueDate: new Date('2024-12-10T00:00:00.000Z'),
			comments: [],
			attachments: [],
			createdAt: new Date('2024-12-02T00:00:00.000Z'),
			updatedAt: new Date('2024-12-05T00:00:00.000Z'),
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
			dueDate: new Date('2024-12-08T00:00:00.000Z'),
			comments: [],
			attachments: [],
			createdAt: new Date('2024-12-03T00:00:00.000Z'),
			updatedAt: new Date('2024-12-03T00:00:00.000Z'),
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
			createdAt: new Date('2024-12-04T00:00:00.000Z'),
			updatedAt: new Date('2024-12-06T00:00:00.000Z'),
			createdBy: '1'
		}
	];
}
