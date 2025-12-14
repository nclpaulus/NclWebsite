export async function getIdlecraftUserId(locals: App.Locals): Promise<string | null> {
	const user = await locals.getUser();
	return user?.id ?? null;
}

export async function requireIdlecraftUserId(locals: App.Locals): Promise<string> {
	const userId = await getIdlecraftUserId(locals);
	if (!userId) throw new Error('UNAUTHORIZED');
	return userId;
}
