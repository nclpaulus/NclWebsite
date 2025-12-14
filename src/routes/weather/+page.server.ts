import { redirect } from '@sveltejs/kit';
import { WEATHER_BASE_PATH } from '$lib/demos/weather';

export const load = () => {
	throw redirect(308, WEATHER_BASE_PATH);
};
