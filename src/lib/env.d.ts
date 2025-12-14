/// <reference types="@sveltejs/kit" />

declare module '$env/static/private' {
	export const RESEND_API_KEY: string;
}

declare module '$env/dynamic/private' {
	export const RESEND_API_KEY: string;
}

declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
}

declare module '$env/dynamic/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
}
