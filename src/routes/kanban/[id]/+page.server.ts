import { redirect } from '@sveltejs/kit';
import { kanbanBoardPath } from '$lib/demos/kanban';

export const load = ({ params }: { params: { id: string } }) => {
	throw redirect(308, kanbanBoardPath(params.id));
};
