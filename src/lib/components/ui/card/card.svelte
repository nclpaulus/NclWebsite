<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	/**
	 * Card (conteneur principal).
	 *
	 * - Rend un `<div>`.
	 * - Utiliser les sous-composants `CardHeader`, `CardContent`, `CardFooter`, etc.
	 */

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
