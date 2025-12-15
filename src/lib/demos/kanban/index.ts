export const KANBAN_BASE_PATH = '/lab/kanban';

export function kanbanBoardPath(id: string): string {
	return `${KANBAN_BASE_PATH}/${id}`;
}
