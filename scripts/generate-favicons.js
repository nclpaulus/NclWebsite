import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins
const inputPath = path.join(__dirname, '../static/logo.png');
const outputDir = path.join(__dirname, '../static');

// Tailles des favicons à générer
const sizes = [
	{ name: 'favicon-16x16.png', size: 16 },
	{ name: 'favicon-32x32.png', size: 32 },
	{ name: 'favicon-192x192.png', size: 192 },
	{ name: 'favicon-512x512.png', size: 512 },
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'favicon.png', size: 32 } // Favicon par défaut
];

async function generateFavicons() {
	try {
		console.log('Génération des favicons à partir du logo...');

		// Vérifier si le fichier d'entrée existe
		if (!fs.existsSync(inputPath)) {
			throw new Error(`Fichier source non trouvé: ${inputPath}`);
		}

		// Générer chaque taille
		for (const { name, size } of sizes) {
			const outputPath = path.join(outputDir, name);

			await sharp(inputPath)
				.resize(size, size, {
					fit: 'contain',
					background: { r: 0, g: 0, b: 0, alpha: 0 }
				})
				.png({ compressionLevel: 9 })
				.toFile(outputPath);

			console.log(`✅ Généré: ${name} (${size}x${size})`);
		}

		console.log('\nTous les favicons ont été générés avec succès!');
	} catch (error) {
		console.error('Erreur lors de la génération des favicons:', error);
		process.exit(1);
	}
}

generateFavicons();
