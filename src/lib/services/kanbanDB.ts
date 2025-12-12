import type { KanbanState } from '$lib/types/kanban';

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

export class KanbanDB {
	private db: IDBDatabase | null = null;
	private readonly DB_NAME = 'NPaulusKanban';
	private readonly VERSION = 1;
	private readonly STORE_NAME = 'state';
	private readonly STATE_KEY = 'kanban';

	isSupported(): boolean {
		return typeof indexedDB !== 'undefined';
	}

	async init(): Promise<void> {
		if (!this.isSupported()) return;

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
	return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

export function serializeKanbanState(state: KanbanState): PersistedKanbanState {
	return JSON.parse(
		JSON.stringify(state, (_key, value) => {
			if (value instanceof Date) return value.toISOString();
			return value;
		})
	) as PersistedKanbanState;
}

export function deserializeKanbanState(raw: PersistedKanbanState): KanbanState {
	return JSON.parse(JSON.stringify(raw), (_key, value) =>
		isIsoString(value) ? new Date(value) : value
	) as KanbanState;
}
