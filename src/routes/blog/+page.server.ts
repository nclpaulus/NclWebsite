import { redirect } from '@sveltejs/kit';

/** Redirige vers /lab (page blog temporairement désactivée). */
export function load() {
	redirect(302, '/lab');
}
