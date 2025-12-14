import type { PageServerLoad } from './$types';
import { idlecraftRpc } from '$lib/demos/idlecraft/server/rpc.server';

export const load: PageServerLoad = async ({ locals }) => {
	// Ensure the player exists (first login bootstrap)
	const player = await idlecraftRpc.createPlayerIfMissing(locals);

	// Apply offline tick (safe to call on every page load)
	const tick = await idlecraftRpc.tickOffline(locals);

	// Read current state (RLS-protected)
	const { data: refreshedPlayer, error: playerError } = await locals.supabase
		.from('players')
		.select('id,user_id,display_name,gold,gold_per_sec,wood_per_sec,ore_per_sec,last_tick_at')
		.eq('id', (player as any).id)
		.single();

	if (playerError) throw playerError;

	const { data: inventory, error: inventoryError } = await locals.supabase
		.from('inventory_items')
		.select('item_key,qty')
		.eq('player_id', (player as any).id)
		.order('item_key');

	if (inventoryError) throw inventoryError;

	return {
		player: refreshedPlayer,
		inventory,
		tick
	};
};
