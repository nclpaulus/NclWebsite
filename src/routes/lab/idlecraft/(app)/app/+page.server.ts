import type { PageServerLoad } from './$types';
import { idlecraftRpc } from '$lib/demos/idlecraft/server/rpc.server';
import type { Actions } from './$types';

/**
 * Interface représentant un joueur dans IdleCraft
 */
type Player = {
	/** Identifiant unique du joueur */
	id: string;
	/** ID de l'utilisateur Supabase associé */
	user_id: string;
	/** Nom d'affichage du joueur */
	display_name: string;
	/** Quantité d'or possédée */
	gold: number;
	/** Taux de production d'or par seconde */
	gold_per_sec: number;
	/** Taux de production de bois par seconde */
	wood_per_sec: number;
	/** Taux de production de minerai par seconde */
	ore_per_sec: number;
	/** Timestamp du dernier tick */
	last_tick_at: string;
};

/**
 * Charge les données du dashboard IdleCraft
 * - Crée le joueur s'il n'existe pas (bootstrap)
 * - Applique le tick offline pour créditer les ressources passives
 * - Récupère l'état actuel du joueur et son inventaire
 */
export const load: PageServerLoad = async ({ locals }) => {
	// Ensure the player exists (first login bootstrap)
	const player = await idlecraftRpc.createPlayerIfMissing(locals) as Player;

	// Apply offline tick (safe to call on every page load)
	const tick = await idlecraftRpc.tickOffline(locals);

	// Read current state (RLS-protected)
	const { data: refreshedPlayer, error: playerError } = await locals.supabase
		.from('players')
		.select('id,user_id,display_name,gold,gold_per_sec,wood_per_sec,ore_per_sec,last_tick_at')
		.eq('id', player.id)
		.single();

	if (playerError) throw playerError;

	const { data: inventory, error: inventoryError } = await locals.supabase
		.from('inventory_items')
		.select('item_key,qty')
		.eq('player_id', player.id)
		.order('item_key');

	if (inventoryError) throw inventoryError;

	return {
		player: refreshedPlayer,
		inventory,
		tick
	};
};

/**
 * Actions du formulaire pour le dashboard IdleCraft
 */
export const actions: Actions = {
	/**
	 * Synchronise manuellement le tick offline
	 * Permet au joueur de forcer la mise à jour de ses ressources
	 * @returns {Object} Les données mises à jour du tick et du joueur
	 */
	sync: async ({ locals }) => {
		const tick = await idlecraftRpc.tickOffline(locals);
		
		// Read updated player state
		const user = await locals.getUser();
		const { data: player } = await locals.supabase
			.from('players')
			.select('id,user_id,display_name,gold,gold_per_sec,wood_per_sec,ore_per_sec,last_tick_at')
			.eq('user_id', user?.id)
			.single();
			
		return { success: true, tick, player };
	}
};
