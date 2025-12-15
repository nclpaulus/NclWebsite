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
	const player = (await idlecraftRpc.createPlayerIfMissing(locals)) as Player;

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

	// Load available upgrades
	const { data: upgrades, error: upgradesError } = await locals.supabase
		.from('farm_upgrades')
		.select('*')
		.order('type', { ascending: true })
		.order('level', { ascending: true });

	if (upgradesError) throw upgradesError;

	// Load player's owned upgrades
	const { data: ownedUpgrades, error: ownedError } = await locals.supabase
		.from('player_farm_upgrades')
		.select('upgrade_id')
		.eq('player_id', player.id);

	if (ownedError) throw ownedError;

	const ownedUpgradeIds = new Set(
		(ownedUpgrades as Array<{ upgrade_id: string }>).map((u) => u.upgrade_id)
	);

	return {
		player: refreshedPlayer,
		inventory,
		tick,
		upgrades: upgrades.map((upgrade) => ({
			...upgrade,
			owned: ownedUpgradeIds.has(upgrade.id)
		}))
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

		// Read updated inventory
		const { data: inventory } = await locals.supabase
			.from('inventory_items')
			.select('item_key, qty')
			.eq('player_id', player?.id || '');

		return { success: true, tick, player, inventory: inventory || [] };
	},

	/**
	 * Achète une upgrade de ferme
	 * @param upgradeKey - Clé de l'upgrade à acheter
	 * @returns {Object} Résultat de l'achat avec nouvelles valeurs
	 */
	buyUpgrade: async ({ locals, request }) => {
		const formData = await request.formData();
		const upgradeKey = formData.get('upgradeKey') as string;

		try {
			const result = await idlecraftRpc.buyFarmUpgrade(locals, { p_upgrade_key: upgradeKey });

			// Read updated player state
			const user = await locals.getUser();
			const { data: player } = await locals.supabase
				.from('players')
				.select('id,user_id,display_name,gold,gold_per_sec,wood_per_sec,ore_per_sec,last_tick_at')
				.eq('user_id', user?.id)
				.single();

			return { success: true, result, player };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : String(error) };
		}
	},

	/**
	 * Supprime le compte du joueur (pour les tests)
	 * Supprime complètement le joueur, ses upgrades et son inventaire
	 * @returns {Object} Confirmation de suppression
	 */
	resetAccount: async ({ locals }) => {
		const user = await locals.getUser();
		if (!user) {
			return { success: false, error: 'UNAUTHORIZED' };
		}

		try {
			// Récupérer le joueur
			const { data: player } = await locals.supabase
				.from('players')
				.select('id')
				.eq('user_id', user.id)
				.single();

			if (!player) {
				return { success: false, error: 'PLAYER_NOT_FOUND' };
			}

			// Supprimer les upgrades du joueur
			await locals.supabase.from('player_farm_upgrades').delete().eq('player_id', player.id);

			// Supprimer l'inventaire
			await locals.supabase.from('inventory_items').delete().eq('player_id', player.id);

			// Supprimer le joueur
			await locals.supabase.from('players').delete().eq('id', player.id);

			return { success: true, deleted: true };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : String(error) };
		}
	},

	/**
	 * Donne de l'or au joueur (pour les tests)
	 * @param amount - Quantité d'or à donner
	 * @returns {Object} Nouvel état du joueur avec l'or ajouté
	 */
	giveGold: async ({ locals, request }) => {
		const user = await locals.getUser();
		if (!user) {
			return { success: false, error: 'UNAUTHORIZED' };
		}

		try {
			const formData = await request.formData();
			const amount = parseInt(formData.get('amount') as string) || 500;

			// Ajouter l'or au joueur
			const { data: currentGold } = await locals.supabase
				.from('players')
				.select('gold')
				.eq('user_id', user.id)
				.single();

			const { data: player } = await locals.supabase
				.from('players')
				.update({
					gold: (currentGold as { gold: number }).gold + amount,
					updated_at: new Date().toISOString()
				})
				.eq('user_id', user.id)
				.select('id,user_id,display_name,gold,gold_per_sec,wood_per_sec,ore_per_sec,last_tick_at')
				.single();

			return { success: true, player };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : String(error) };
		}
	}
};
