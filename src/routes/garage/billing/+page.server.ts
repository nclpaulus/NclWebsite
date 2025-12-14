import { redirect } from '@sveltejs/kit';
import { GARAGE_BILLING_PATH } from '$lib/demos/garage';

export const load = () => {
	throw redirect(308, GARAGE_BILLING_PATH);
};
