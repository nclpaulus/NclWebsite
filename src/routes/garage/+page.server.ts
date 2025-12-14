import { redirect } from '@sveltejs/kit';
import { GARAGE_BASE_PATH } from '$lib/demos/garage';

export const load = () => {
	throw redirect(308, GARAGE_BASE_PATH);
};
