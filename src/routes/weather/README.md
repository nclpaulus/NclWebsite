# Section Météo - Documentation

## 🌤️ Vue d'ensemble

Cette section météo interactive offre une expérience complète de consultation des prévisions météorologiques avec des fonctionnalités avancées de visualisation et d'historique.

## ✨ Fonctionnalités implémentées

### 1. **Prévisions sur 7 jours**

- Affichage détaillé des prévisions météo pour les 7 prochains jours
- Températures minimales et maximales
- Conditions météorologiques avec icônes
- Humidité et vitesse du vent

### 2. **Cartes météo interactives**

- Carte Leaflet intégrée avec plusieurs couches météo
- Couches disponibles : Précipitations, Température, Nuages, Pression, Vent
- Clic sur la carte pour obtenir la météo d'un point spécifique
- Bouton de géolocalisation automatique

### 3. **Géolocalisation automatique**

- Détection automatique de la position de l'utilisateur
- Permission demandée de manière sécurisée
- Fallback sur Paris si la géolocalisation échoue
- Possibilité de basculer entre mode automatique et manuel

### 4. **Historique des données**

- Sauvegarde automatique des consultations dans localStorage
- Affichage des 30 dernières consultations
- Statistiques : température moyenne, minimum et maximum
- Export des données au format JSON
- Fonction de nettoyage de l'historique

### 5. **Interface responsive**

- Design adaptatif pour mobile et desktop
- Utilisation de TailwindCSS et shadcn-svelte
- Mode sombre/clair supporté
- Animations et transitions fluides

## 🔧 Configuration requise

### Clé API OpenWeatherMap

1. Créez un compte sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenez votre clé API gratuite (1000 appels/jour)
3. Créez un fichier `.env` à la racine du projet :
   ```
   VITE_OPENWEATHER_API_KEY=votre_clé_api_ici
   ```

### Dépendances installées

- `leaflet` - Pour les cartes interactives
- `@types/leaflet` - Types TypeScript pour Leaflet

## 📁 Structure des fichiers

```
src/
├── routes/
│   └── weather/
│       ├── +page.svelte          # Page principale météo
│       └── README.md             # Cette documentation
├── lib/
│   ├── stores/
│   │   └── weather.svelte.ts     # Store météo avec état global
│   └── components/
│       └── weather/
│           ├── WeatherCard.svelte      # Carte météo actuelle
│           ├── ForecastList.svelte     # Liste des prévisions
│           ├── WeatherMap.svelte       # Carte interactive
│           └── WeatherHistory.svelte   # Historique des données
```

## 🚀 Utilisation

### Accès à la section

La section météo est accessible via :

- Le menu de navigation : 🌤️ Météo
- URL directe : `http://localhost:5174/weather`

### Fonctionnalités de l'interface

1. **Rafraîchissement manuel** : Bouton 🔄 pour recharger les données
2. **Changement de position** : Bouton 📍 pour basculer entre géolocalisation et manuel
3. **Carte interactive** : Cliquez sur n'importe quel point pour obtenir la météo
4. **Historique** : Consultez vos recherches précédentes avec statistiques

## 🛠️ Architecture technique

### Store météo (`weather.svelte.ts`)

- Gestion de l'état global avec Svelte stores
- Appels API optimisés avec Promise.all
- Gestion des erreurs et états de chargement
- Persistance des données avec localStorage

### Composants modulaires

- **WeatherCard** : Affichage des conditions actuelles
- **ForecastList** : Grille responsive des prévisions
- **WeatherMap** : Carte Leaflet avec couches météo
- **WeatherHistory** : Tableau des consultations passées

### Gestion des erreurs

- Messages d'erreur clairs et informatifs
- Fallback sur position par défaut (Paris)
- Gestion des permissions de géolocalisation

## 🔒 Sécurité et performances

### Sécurité

- Clé API stockée dans variables d'environnement
- Validation des entrées utilisateur
- Gestion sécurisée des permissions

### Performances

- Chargement lazy des composants carte
- Mise en cache des données localStorage
- Optimisation des appels API
- Responsive design pour tous appareils

## 🚀 Évolutions possibles

### Notifications PWA (à implémenter)

- Alertes météo automatiques
- Notifications de changements importants
- Rappels de consultation

### Fonctionnalités avancées

- Prévisions détaillées par heure
- Graphiques de tendances météo
- Export PDF des rapports
- Partage des prévisions sur réseaux sociaux

### Améliorations techniques

- Service Worker pour mode hors-ligne
- IndexedDB pour gros volumes de données
- Web Workers pour calculs intensifs

## 🐛 Dépannage

### Problèmes courants

1. **Clé API invalide** : Vérifiez votre fichier `.env`
2. **Géolocalisation bloquée** : Acceptez les permissions du navigateur
3. **Carte ne s'affiche pas** : Vérifiez la connexion internet

### Logs et debug

- Console browser pour erreurs détaillées
- Network tab pour vérifier les appels API
- localStorage pour vérifier l'historique

---

**Développé avec SvelteKit, TailwindCSS et Leaflet**  
_API OpenWeatherMap pour les données météorologiques_
