import type { PostgrestError } from '@supabase/supabase-js';

type RpcArgs = Record<string, unknown>;

type RpcResponse<T> = {
	data: T | null;
	error: PostgrestError | null;
};

async function rpc<T>(locals: App.Locals, fn: string, args?: RpcArgs): Promise<RpcResponse<T>> {
	return (await locals.supabase.rpc(fn as never, (args ?? {}) as never)) as RpcResponse<T>;
}

async function rpcOrThrow<T>(locals: App.Locals, fn: string, args?: RpcArgs): Promise<T> {
	const { data, error } = await rpc<T>(locals, fn, args);
	if (error) throw error;
	return data as T;
}

export const idlecraftRpc = {
	createPlayerIfMissing: (locals: App.Locals) => rpcOrThrow(locals, 'create_player_if_missing'),
	tickOffline: (locals: App.Locals) => rpcOrThrow(locals, 'tick_offline'),
	postListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'post_listing', args),
	buyListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'buy_listing', args),
	cancelListing: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'cancel_listing', args),
	craftItem: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'craft_item', args),
	buyFarmUpgrade: (locals: App.Locals, args: RpcArgs) => rpcOrThrow(locals, 'buy_farm_upgrade', args)
};
