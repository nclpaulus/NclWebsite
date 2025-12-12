export type Profile = 'pro' | 'gamer' | 'lambda';
export type ProfileTheme = Record<string, string>;

export interface ProfileSettings {
	currentProfile: Profile | null;
	themePreferences: Record<string, unknown>;
	lastVisit: string;
}

export interface SettingItem {
	key: string;
	value: unknown;
	timestamp?: number;
}

/**
 * Accès persistant aux préférences de profil via IndexedDB.
 *
 * Remarque: ce service s'utilise côté navigateur (IndexedDB). Utiliser `isSupported()` avant.
 */
export class ProfileDB {
	private db: IDBDatabase | null = null;
	private readonly DB_NAME = 'NPaulusProfile';
	private readonly VERSION = 1;
	private readonly STORE_NAME = 'settings';

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

	/** Sauvegarde une clé/valeur dans l'object store. */
	async setSetting(key: string, value: unknown): Promise<void> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.put({ key, value, timestamp: Date.now() });

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	/** Lit une valeur typée depuis l'object store. */
	async getSetting<T>(key: string): Promise<T | null> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.get(key);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result?.value || null);
		});
	}

	/** Retourne toutes les settings sous forme de dictionnaire. */
	async getAllSettings(): Promise<Record<string, unknown>> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.getAll();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const settings: Record<string, unknown> = {};
				request.result.forEach((item: SettingItem) => {
					settings[item.key] = item.value;
				});
				resolve(settings);
			};
		});
	}

	/** Efface toutes les settings. */
	async clearSettings(): Promise<void> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
			const store = transaction.objectStore(this.STORE_NAME);
			const request = store.clear();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	/** Sauvegarde plusieurs settings en une fois. */
	async saveProfileSettings(settings: Partial<ProfileSettings>): Promise<void> {
		await Promise.all(Object.entries(settings).map(([key, value]) => this.setSetting(key, value)));
	}

	/** Charge les settings principales de profil (avec valeurs par défaut). */
	async getProfileSettings(): Promise<ProfileSettings> {
		const [currentProfile, themePreferences, lastVisit] = await Promise.all([
			this.getSetting<Profile>('currentProfile'),
			this.getSetting('themePreferences'),
			this.getSetting<string>('lastVisit')
		]);

		return {
			currentProfile,
			themePreferences: (themePreferences as Record<string, unknown>) || {},
			lastVisit: (lastVisit as string) || new Date().toISOString()
		};
	}

	/** Indique si IndexedDB est disponible dans l'environnement courant. */
	isSupported(): boolean {
		return typeof indexedDB !== 'undefined';
	}
}

// Singleton instance
export const profileDB = new ProfileDB();
