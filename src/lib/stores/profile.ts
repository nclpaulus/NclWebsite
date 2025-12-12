/**
 * Store de gestion du profil utilisateur et du thème.
 *
 * Persiste le profil dans IndexedDB avec fallback localStorage.
 */
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { profileDB, type Profile, type ProfileTheme } from '$lib/services/profileDB';

/**
 * Crée le store de profil avec persistance IndexedDB et fallback localStorage.
 *
 * @returns Store avec méthodes init, switch, reset et abonnement Svelte.
 */
function createProfileStore() {
	const { subscribe, set } = writable<Profile | null>(null);
	let initialized = false;

	return {
		subscribe,
		/** Initialise le store depuis IndexedDB ou localStorage. */
		init: async () => {
			if (initialized || !browser) return;

			try {
				// Initialiser IndexedDB
				await profileDB.init();

				// Récupérer le profil sauvegardé
				const saved = await profileDB.getSetting<Profile>('currentProfile');
				if (saved) {
					set(saved);
					updateThemeSafe(saved);
				}

				// Mettre à jour la date de dernière visite
				await profileDB.setSetting('lastVisit', new Date().toISOString());

				initialized = true;
			} catch (error) {
				console.warn('IndexedDB failed, using fallback localStorage:', error);
				// Fallback localStorage si IndexedDB échoue
				const fallback = localStorage.getItem('selectedProfile') as Profile;
				if (fallback) {
					set(fallback);
					updateThemeSafe(fallback);
				}
				initialized = true;
			}
		},
		/** Bascule vers un nouveau profil et le persiste. */
		switch: async (newProfile: Profile) => {
			if (!browser) return;

			try {
				// Sauvegarder dans IndexedDB
				await profileDB.setSetting('currentProfile', newProfile);
				set(newProfile);
				updateThemeSafe(newProfile);
			} catch (error) {
				console.warn('IndexedDB write failed, using fallback localStorage:', error);
				// Fallback localStorage
				localStorage.setItem('selectedProfile', newProfile);
				set(newProfile);
				updateThemeSafe(newProfile);
			}
		},
		/** Réinitialise le profil à null et nettoie la persistance. */
		reset: async () => {
			if (!browser) return;

			try {
				await profileDB.setSetting('currentProfile', null);
				set(null);
				updateThemeSafe(null);
			} catch (error) {
				console.warn('IndexedDB reset failed, using fallback localStorage:', error);
				localStorage.removeItem('selectedProfile');
				set(null);
				updateThemeSafe(null);
			}
		}
	};
}

export const profile = createProfileStore();

/** Store dérivé pour le thème actuel en fonction du profil. */
export const currentTheme = derived(profile, ($profile) => getThemeForProfile($profile));

/** Store dérivé pour savoir si un profil est sélectionné. */
export const hasProfile = derived(profile, ($profile) => $profile !== null);

/** Retourne les couleurs du thème pour un profil donné. */
function getThemeForProfile(profile: Profile | null): ProfileTheme {
	const themes = {
		pro: {
			primary: 'hsl(220, 90%, 56%)',
			secondary: 'hsl(220, 14%, 96%)',
			accent: 'hsl(220, 84%, 75%)',
			background: 'hsl(220, 20%, 98%)',
			foreground: 'hsl(220, 10%, 15%)',
			muted: 'hsl(220, 14%, 96%)',
			border: 'hsl(220, 30%, 90%)'
		},
		gamer: {
			primary: 'hsl(0, 84%, 60%)',
			secondary: 'hsl(0, 84%, 95%)',
			accent: 'hsl(280, 84%, 75%)',
			background: 'hsl(0, 10%, 5%)',
			foreground: 'hsl(0, 10%, 95%)',
			muted: 'hsl(0, 10%, 15%)',
			border: 'hsl(0, 30%, 20%)'
		},
		lambda: {
			primary: 'hsl(142, 76%, 36%)',
			secondary: 'hsl(142, 76%, 95%)',
			accent: 'hsl(200, 76%, 75%)',
			background: 'hsl(142, 20%, 98%)',
			foreground: 'hsl(142, 20%, 15%)',
			muted: 'hsl(142, 30%, 94%)',
			border: 'hsl(142, 40%, 88%)'
		}
	};

	return themes[profile || 'lambda'];
}

/** Applique le thème au DOM côté client uniquement. */
function updateThemeSafe(profile: Profile | null) {
	if (!browser) return;

	const theme = getThemeForProfile(profile);
	const root = document.documentElement;

	// Appliquer les variables CSS pour le thème actuel
	Object.entries(theme).forEach(([key, value]) => {
		root.style.setProperty(`--color-${key}`, value);
	});

	// Ajouter une classe au body pour le style global
	document.body.className = document.body.className.replace(/profile-\w+/g, '');
	if (profile) {
		document.body.classList.add(`profile-${profile}`);
	}
}

/** Métadonnées des profils (nom, icône, description, couleur). */
export const profileInfo = {
	pro: {
		name: 'Professionnel',
		icon: '💼',
		description: 'Portfolio, projets, expertise technique',
		color: 'blue'
	},
	gamer: {
		name: 'Gamer',
		icon: '🎮',
		description: 'Stats, achievements, communauté',
		color: 'red'
	},
	lambda: {
		name: 'Personnel',
		icon: '👤',
		description: 'Blog, hobbies, vie quotidienne',
		color: 'green'
	}
} as const;
