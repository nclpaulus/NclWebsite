import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	type CookieMethodsServer = Parameters<typeof createServerClient>[2]['cookies'];
	type CookiesToSet = Parameters<NonNullable<CookieMethodsServer['setAll']>>[0];

	const cookieMethods: CookieMethodsServer = {
		getAll() {
			return event.cookies.getAll();
		},
		setAll(cookiesToSet: CookiesToSet) {
			cookiesToSet.forEach(({ name, value, options }) => {
				const cookieOptions = options as unknown as Parameters<typeof event.cookies.set>[2];
				event.cookies.set(name, value, { ...cookieOptions, path: cookieOptions?.path ?? '/' });
			});
		}
	};

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: cookieMethods
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.getUser = async () => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return user;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
