<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
</script>

<section class="py-24">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div class="space-y-6">
				<h2 class="text-4xl font-bold text-foreground">Un peu plus personnel</h2>
				<p class="text-lg text-muted-foreground leading-relaxed">
					En dehors du code, il y a surtout :
				</p>
				<div class="space-y-4">
					<div class="flex items-start space-x-4">
						<div
							class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1"
						>
							<span class="text-lg">🎮</span>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Jeux vidéo</h3>
							<p class="text-muted-foreground">
								Nourrissent ma curiosité pour les systèmes, les builds, les mécaniques cachées
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-4">
						<div
							class="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0 mt-1"
						>
							<span class="text-lg">⚙️</span>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Mécanique / Technique</h3>
							<p class="text-muted-foreground">
								Le goût de "comprendre comment ça marche" avant de vouloir l'améliorer
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-4">
						<div
							class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-1"
						>
							<span class="text-lg">😊</span>
						</div>
						<div>
							<h3 class="font-semibold mb-1">Ambiance saine</h3>
							<p class="text-muted-foreground">
								Être sérieux sur le fond sans se prendre au sérieux sur la forme
							</p>
						</div>
					</div>
				</div>
			</div>

			<div>
				<Card class="p-8 bg-linear-to-br from-primary/5 to-secondary/5 border-primary/10">
					<CardContent class="space-y-6">
						<h3 class="text-2xl font-semibold mb-4">Une philosophie simple</h3>
						<blockquote class="text-lg text-muted-foreground italic leading-relaxed">
							"Le code doit être comme une bonne blague : pas besoin de l'expliquer pour qu'on
							comprenne. Et si vraiment il faut une explication, elle devrait être courte et
							claire."
						</blockquote>
						<p class="text-muted-foreground">
							— Mon approche du développement et de la vie en général
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</section>
