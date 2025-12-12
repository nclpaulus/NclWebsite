import type { KanbanState } from '$lib/types/kanban';

/**
 * Représentation persistée (IndexedDB) du state Kanban.
 *
 * Remarque: on stocke un snapshot complet sérialisé (dates => ISO strings).
 */
export interface PersistedKanbanState {
	boards: unknown[];
	currentBoard: unknown | null;
	columns: unknown[];
	cards: unknown[];
	users: unknown[];
	labels: unknown[];
	loading: boolean;
	error: string | null;
	filters: Record<string, unknown>;
}

/**
 * Accès persistant au state Kanban via IndexedDB.
 *
 * Ce service est destiné au navigateur. Utiliser `isSupported()` avant `init()`.
 */
export class KanbanDB {
	private db: IDBDatabase | null = null;
	private readonly DB_NAME = 'NPaulusKanban';
	private readonly VERSION = 1;
	private readonly STORE_NAME = 'state';
	private readonly STATE_KEY = 'kanban';

	/** Indique si IndexedDB est disponible dans l'environnement courant. */
	isSupported(): boolean {
		return typeof indexedDB !== 'undefined';
	}

	/** Initialise la base IndexedDB et prépare l'object store. */
	async init(): Promise<void> {
		if (!this.isSupported()) {
			throw new Error('IndexedDB non supportée');
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.STORE_NAME)) {
					db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
				}
			};
		});
	}

	/** Écrit le snapshot complet du state. */
	async setState(state: PersistedKanbanState): Promise<void> {
		if (!this.db) await this.init();
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.put({ key: this.STATE_KEY, value: state, timestamp: Date.now() });

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	/** Lit le snapshot complet du state. */
	async getState(): Promise<PersistedKanbanState | null> {
		if (!this.db) await this.init();
		if (!this.db) return null;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.get(this.STATE_KEY);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result?.value || null);
		});
	}

	/** Supprime le snapshot du state. */
	async clear(): Promise<void> {
		if (!this.db) await this.init();
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.delete(this.STATE_KEY);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
}

export const kanbanDB = new KanbanDB();

function isIsoString(value: unknown): value is string {
	return (
		typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)
	);
}

/** Sérialise le state pour IndexedDB (dates => ISO strings). */
export function serializeKanbanState(state: KanbanState): PersistedKanbanState {
	return JSON.parse(
		JSON.stringify(state, (_key, value) => {
			if (value instanceof Date) return value.toISOString();
			return value;
		})
	) as PersistedKanbanState;
}

/** Désérialise le state depuis IndexedDB (ISO strings => Date). */
export function deserializeKanbanState(raw: PersistedKanbanState): KanbanState {
	try {
		return JSON.parse(JSON.stringify(raw), (_key, value) =>
			isIsoString(value) ? new Date(value) : value
		) as KanbanState;
	} catch {
		// Si les données persistées sont corrompues, on retourne un état vide.
		return {
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
	}
}
