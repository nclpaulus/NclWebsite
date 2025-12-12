/// <reference types="@sveltejs/kit" />

declare module '$env/static/private' {
	export const RESEND_API_KEY: string;
}

declare module '$env/dynamic/private' {
	export const RESEND_API_KEY: string;
}
