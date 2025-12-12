import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins
const inputPath = path.join(__dirname, '../static/logo.png');
const outputPath = path.join(__dirname, '../static/logo-optimized.png');

async function optimizeLogo() {
	try {
		console.log('Optimisation du logo...');

		// Vérifier si le fichier d'entrée existe
		if (!fs.existsSync(inputPath)) {
			throw new Error(`Fichier source non trouvé: ${inputPath}`);
		}

		// Obtenir les infos de l'image originale
		const originalStats = fs.statSync(inputPath);
		console.log(`Taille originale: ${(originalStats.size / 1024).toFixed(2)} KB`);

		// Optimiser le logo avec une qualité réduite mais acceptable
		await sharp(inputPath)
			.resize(512, 512, {
				// Taille maximale raisonnable
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			})
			.png({
				compressionLevel: 9,
				quality: 85,
				progressive: true
			})
			.toFile(outputPath);

		// Vérifier la taille optimisée
		const optimizedStats = fs.statSync(outputPath);
		const reduction = (
			((originalStats.size - optimizedStats.size) / originalStats.size) *
			100
		).toFixed(1);

		console.log(`✅ Taille optimisée: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
		console.log(`📉 Réduction: ${reduction}%`);

		// Remplacer l'original par l'optimisé
		fs.copyFileSync(outputPath, inputPath);
		fs.unlinkSync(outputPath);
		console.log('✅ Logo original remplacé par la version optimisée');
	} catch (error) {
		console.error("Erreur lors de l'optimisation:", error);
		process.exit(1);
	}
}

optimizeLogo();
