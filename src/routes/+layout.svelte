<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<title>NPaulusWebsite</title>
	<meta name="description" content="Site web personnel - Portfolio, Gaming, Blog et Contact" />
</svelte:head>

<div class="min-h-screen bg-background">
	<Navigation />
	
	<main>
		{@render children()}
	</main>
	
	<footer class="border-t border-border bg-muted/50 mt-16">
		<div class="container mx-auto px-4 py-8">
			<div class="flex flex-col md:flex-row items-center justify-between">
				<div class="flex items-center space-x-2 mb-4 md:mb-0">
					<span class="text-2xl">🚀</span>
					<span class="font-semibold text-foreground">NPaulusWebsite</span>
				</div>
				
				<div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
					<p>&copy; 2024 NPaulusWebsite. Tous droits réservés.</p>
					<div class="flex space-x-4">
						<a href="/contact" class="hover:text-foreground transition-colors">Contact</a>
						<a href="/blog" class="hover:text-foreground transition-colors">Blog</a>
						<a href="/portfolio" class="hover:text-foreground transition-colors">Portfolio</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
