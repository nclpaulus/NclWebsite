import { redirect } from '@sveltejs/kit';
import { KANBAN_BASE_PATH } from '$lib/demos/kanban';

export const load = () => {
	throw redirect(308, KANBAN_BASE_PATH);
};
