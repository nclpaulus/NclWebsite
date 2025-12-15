/**
 * Helpers d'authentification pour IdleCraft côté serveur
 * Fournit des fonctions utilitaires pour gérer l'identité des joueurs
 */

/**
 * Récupère l'ID utilisateur Supabase pour le contexte actuel
 * @param locals - Contexte SvelteKit côté serveur
 * @returns Promise<string | null> ID de l'utilisateur ou null si non connecté
 */
export async function getIdlecraftUserId(locals: App.Locals): Promise<string | null> {
	const user = await locals.getUser();
	return user?.id ?? null;
}

/**
 * Récupère l'ID utilisateur et lève une erreur si non connecté
 * Utilitaire pour les routes qui nécessitent une authentification obligatoire
 * @param locals - Contexte SvelteKit côté serveur
 * @returns Promise<string> ID de l'utilisateur
 * @throws Error si l'utilisateur n'est pas connecté
 */
export async function requireIdlecraftUserId(locals: App.Locals): Promise<string> {
	const userId = await getIdlecraftUserId(locals);
	if (!userId) throw new Error('UNAUTHORIZED');
	return userId;
}
