<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { Button } from 'bits-ui';
	import { buttonVariants } from './index.ts';
	import type { ButtonVariants } from './index.ts';

	/**
	 * Button UI (wrapper Bits UI).
	 *
	 * - Le styling est dérivé de `buttonVariants`.
	 * - Supporte les variants (`variant`) et tailles (`size`).
	 */
	type $$Props = Button.RootProps & {
		class?: string;
		children: Snippet;
		variant?: ButtonVariants['variant'];
		size?: ButtonVariants['size'];
		asChild?: boolean;
	};

	let {
		class: className = undefined,
		children,
		variant = 'default',
		size = 'default',
		...restProps
	}: $$Props = $props();

	export { className as class };
</script>

<Button.Root class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
	{@render children()}
</Button.Root>
