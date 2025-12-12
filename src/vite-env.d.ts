/// <reference types="svelte" />

declare module '$lib/assets/*.png?*' {
	const value: { src: string; srcset: string; sizes: string };
	export default value;
}
