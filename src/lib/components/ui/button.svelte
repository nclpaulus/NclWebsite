<script lang="ts">
	import { type Snippet } from "svelte";
	import { cn } from "$lib/utils";
	import { Button } from "bits-ui";
	import { buttonVariants } from "./index.js";

	type $$Props = Button.RootProps & {
		class?: string;
		children: Snippet;
		variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
		size?: "default" | "sm" | "lg" | "icon";
	};

	let {
		class: className = undefined,
		children,
		variant = "default",
		size = "default",
		...restProps
	}: $$Props = $props();

	export { className as class };
</script>

<Button.Root
	class={cn(buttonVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children()}
</Button.Root>
