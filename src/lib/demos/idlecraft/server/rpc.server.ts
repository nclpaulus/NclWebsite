import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Arguments génériques pour les appels RPC
 */
type RpcArgs = Record<string, unknown>;

/**
 * Réponse d'un appel RPC Supabase
 * @template T Type des données retournées
 */
type RpcResponse<T> = {
	/** Données retournées par la RPC ou null si erreur */
	data: T | null;
	/** Erreur Supabase ou null si succès */
	error: PostgrestError | null;
};

/**
 * Effectue un appel RPC Supabase côté serveur
 * @template T Type des données attendues
 * @param locals - Contexte SvelteKit côté serveur
 * @param fn - Nom de la fonction RPC à appeler
 * @param args - Arguments à passer à la fonction RPC
 * @returns Promise<RpcResponse<T>> Réponse de la RPC
 */
async function rpc<T>(locals: App.Locals, fn: string, args?: RpcArgs): Promise<RpcResponse<T>> {
	return (await locals.supabase.rpc(fn as never, (args ?? {}) as never)) as RpcResponse<T>;
}

/**
 * Effectue un appel RPC et lève une erreur en cas d'échec
 * @template T Type des données attendues
 * @param locals - Contexte SvelteKit côté serveur
 * @param fn - Nom de la fonction RPC à appeler
 * @param args - Arguments à passer à la fonction RPC
 * @returns Promise<T> Données retournées par la RPC
 * @throws PostgrestError si l'appel échoue
 */
async function rpcOrThrow<T>(locals: App.Locals, fn: string, args?: RpcArgs): Promise<T> {
	const { data, error } = await rpc<T>(locals, fn, args);
	if (error) throw error;
	return data as T;
}

/**
 * Collection des wrappers RPC pour IdleCraft
 * Fournit une interface type-safe pour appeler les fonctions PostgreSQL
 */
export const idlecraftRpc = {
	/**
	 * Crée le joueur s'il n'existe pas déjà
	 * @param locals - Contexte SvelteKit côté serveur
	 * @returns Données du joueur créé ou existant
	 */
	createPlayerIfMissing: (locals: App.Locals) => rpcOrThrow(locals, 'create_player_if_missing'),

	/**
	 * Applique le tick offline pour créditer les ressources passives
	 * @param locals - Contexte SvelteKit côté serveur
	 * @returns Informations sur le tick appliqué (secondes écoulées/créditées)
	 */
	tickOffline: (locals: App.Locals) => rpcOrThrow(locals, 'tick_offline'),

	/**
	 * Crée une nouvelle offre sur le marché
	 * @param locals - Contexte SvelteKit côté serveur
	 * @param args - Arguments de l'offre (item, quantité, prix)
	 * @returns Offre créée sur le marché
	 */
	postListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'post_listing', args),

	/**
	 * Achète une offre existante sur le marché
	 * @param locals - Contexte SvelteKit côté serveur
	 * @param args - Arguments de l'achat (ID de l'offre)
	 * @returns Résultat de la transaction
	 */
	buyListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'buy_listing', args),

	/**
	 * Annule une offre sur le marché
	 * @param locals - Contexte SvelteKit côté serveur
	 * @param args - Arguments de l'annulation (ID de l'offre)
	 * @returns Offre annulée
	 */
	cancelListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'cancel_listing', args),

	/**
	 * Craft un item selon une recette
	 * @param locals - Contexte SvelteKit côté serveur
	 * @param args - Arguments du craft (recette, quantité)
	 * @returns Items craftés
	 */
	craftItem: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'craft_item', args),

	/**
	 * Achète une amélioration de ferme
	 * Vérifie les coûts, les prérequis et met à jour les taux de production
	 * @param locals - Contexte SvelteKit côté serveur
	 * @param args - Arguments de l'achat (clé de l'upgrade)
	 * @returns Résultat de l'achat avec nouvelles valeurs de production
	 */
	buyFarmUpgrade: (locals: App.Locals, args: RpcArgs) =>
		rpcOrThrow(locals, 'buy_farm_upgrade', args)
};
