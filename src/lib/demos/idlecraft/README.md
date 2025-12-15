# IdleCraft — Plan d’action (Auth + Persistance + RLS + RPC)

## Objectif
IdleCraft est une démo **"idle + sessions courtes"** pensée pour mettre en avant :
- l’**authentification** (Google + Discord + Email/Password) via Supabase
- la **persistance de données** (progression, inventaire, marché, historique)
- une approche **backend-first** “comme un vrai produit” : **RLS** (Row Level Security) + opérations critiques via **RPC Postgres** transactionnelles

## Définition du jeu (MVP)
### Ressources
- `gold` (monnaie)
- `wood` (ressource)
- `ore` (ressource)

Ressources brutes supplémentaires (pour donner du sens au craft et à l’économie) :
- `food`
- `stone`
- `fiber`

Ressources intermédiaires / produits finis (exemples) :
- `wood_plank`
- `iron_ingot`
- `rope`

### Boucle idle (passif)
- Le joueur produit des ressources via des taux : `gold_per_sec`, `wood_per_sec`, `ore_per_sec`.
- Le rattrapage se fait au moment où le joueur interagit (ou ouvre l’app) via un **tick serveur**.
- **Cap offline** : 12h (limite la spéculation et simplifie l’équilibrage).

### Sessions courtes (actif)
- **Craft** : consomme des ressources (inputs) et produit des outputs (ressources intermédiaires / produits finis, voire items) via recettes.
- **Missions** : action “timée” (2–5 minutes typiquement). Une fois terminée, le joueur **claim** une récompense (gold/wood/ore).

### MMO light
- **Marketplace** : vente/achat de `wood/ore` (et plus tard items)
- **Leaderboard** : classement des joueurs (gold, puissance, etc.)

---

## Stack technique (recommandée)
- **SvelteKit** (UI, routing, SSR)
- **Supabase Auth** : Google + Discord + Email/Password
- **Postgres (Supabase)** : source de vérité
- **RLS activée** sur les tables “jeu”
- **RPC Postgres (`security definer`)** pour :
  - tick offline
  - marketplace (buy/sell)
  - missions (start/claim)
  - bootstrap player

Note Supabase : `@supabase/auth-helpers-sveltekit` est déprécié. L’approche recommandée côté SSR est basée sur `@supabase/ssr`.

---

## État actuel (déjà implémenté dans le repo)

### Auth Supabase SSR (SvelteKit)
- `package.json` : dépendances ajoutées (`@supabase/supabase-js`, `@supabase/ssr`).
- `src/hooks.server.ts` : création du client SSR via `createServerClient(...)` + cookies `getAll/setAll`.
- `src/app.d.ts` : `App.Locals` exposent :
  - `locals.supabase`
  - `locals.getSession()`
  - `locals.getUser()`
  - `PageData.session` est optionnel (pour ne pas casser les autres pages).
- `src/lib/env.d.ts` : déclaration des variables d’env publiques Supabase.
- `src/lib/supabase/client.ts` : helper `createSupabaseBrowserClient()` (client navigateur).
- `.env.example` : template des variables :
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`

### Routes IdleCraft (squelette UI + auth)
- Landing (publique) : `src/routes/lab/idlecraft/+page.svelte`
  - login OAuth (Google/Discord) avec redirect vers `/lab/idlecraft/auth/callback`.
- Callback OAuth : `src/routes/lab/idlecraft/auth/callback/+page.server.ts`
  - échange `code` → session via `locals.supabase.auth.exchangeCodeForSession(code)`.
- Signout : `src/routes/lab/idlecraft/auth/signout/+server.ts`.
- Zone protégée (guard d’auth) : `src/routes/lab/idlecraft/(app)/+layout.server.ts`
  - refuse l’accès si `locals.getUser()` est null, redirige vers `/lab/idlecraft`.
- Layout UI app : `src/routes/lab/idlecraft/(app)/+layout.svelte`.
- Pages app stub :
  - `src/routes/lab/idlecraft/(app)/app/+page.svelte`
  - `src/routes/lab/idlecraft/(app)/market/+page.svelte`
  - `src/routes/lab/idlecraft/(app)/leaderboard/+page.svelte`
- Compte email/password : `src/routes/lab/idlecraft/account/+page.svelte` + `+page.server.ts`.

### DB (MVP) + RLS
- Tables créées : `players`, `inventory_items`.
- RLS activée + policies “own data” sur `players` et `inventory_items`.

### Auth Providers
- Google OAuth configuré et fonctionnel en local.

### Couche server-only (RPC wrappers)
- `src/lib/demos/idlecraft/server/rpc.server.ts` : wrappers `idlecraftRpc.*` (server-only).
- `src/lib/demos/idlecraft/server/auth.server.ts` : helpers `getIdlecraftUserId` / `requireIdlecraftUserId`.

### WIP : wiring app → DB/RPC
- `/lab/idlecraft/app` est branchée côté serveur via :
  - `src/routes/lab/idlecraft/(app)/app/+page.server.ts`
  - affichage "debug" : player + inventaire + retour du tick

Note : juste après une première connexion, le player est créé avec `last_tick_at = now()`, donc un premier `tick_offline` peut retourner `elapsed_seconds = 0`. Pour valider rapidement le tick : attendre 3–10 secondes, rafraîchir `/lab/idlecraft/app`, ou fermer l'onglet et revenir plus tard.

### UI/UX Dashboard (implémenté)
- **Bouton Sync Offline** : permet de déclencher manuellement le tick
- **Animations** : gain d'or avec animation fly quand les ressources sont créditées
- **Icônes** : ressources représentées par des icônes Lucide (Coins, Trees, Gem)
- **Design moderne** : cartes avec hover effects et formatage des nombres
- **Feedback visuel** : état de chargement et transitions fluides

---

## Prochaines étapes (recommandées)

### 1) Configuration Supabase (dashboard)
- Activer les providers Auth : Google + Discord + Email/password.
- Ajouter les redirect URLs (local + prod) :
  - `http://localhost:5173/lab/idlecraft/auth/callback`
  - `https://<ton-domaine>/lab/idlecraft/auth/callback`
- Créer un `.env.local` (à partir de `.env.example`) avec :
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`

### 2) Base de données (schéma + RLS)
- Implémenter les tables MVP (`players`, `inventory_items`, `missions`, `player_missions`, `market_listings`, `market_trades`, `craft_recipes`, etc.).
- Activer la RLS et écrire les policies décrites ci-dessous.

### 3) RPC Postgres (transactions)
- Créer les fonctions `security definer` MVP :
  - `create_player_if_missing`
  - `tick_offline`
  - marketplace : `post_listing`, `buy_listing`, `cancel_listing`
  - craft : `craft_item`
  - upgrades : `buy_farm_upgrade`

### 4) Couche “RPC wrappers” côté SvelteKit (TODO)
- Ajouter un petit module côté `src/lib/demos/idlecraft/` pour centraliser les appels `supabase.rpc(...)`.
- Prévoir 2 surfaces :
  - wrapper “server” (basé sur `locals.supabase`)
  - wrapper “browser” (basé sur `createSupabaseBrowserClient()`)

### 5) Brancher l’UI sur le backend
- Sur `/lab/idlecraft/app` : appeler `tick_offline` au chargement (ou via bouton “Sync offline”).
- Sur `/market` : afficher les listings, puis brancher `post/buy/cancel`.
- Sur `/leaderboard` : lire `players` trié par `gold`.

---

## UI/UX & stratégie d’assets (graphisme évolutif)
Objectif : avancer vite sur le cœur (auth/DB/RPC) sans se bloquer sur le graphisme, tout en gardant une trajectoire claire vers un rendu “idle game”.

### Phase 1 — UI “product” (MVP rapide)
- UI type dashboard avec `shadcn-svelte` (tabs/panels : Production, Upgrades, Craft, Missions).
- Ressources/outils représentés par **icônes SVG** (Lucide/Iconify).
- Illustrations légères (bannière + 1–2 pictos) si nécessaire.

Avantages :
- livraison rapide d’un MVP jouable
- rendu moderne et lisible (portfolio-friendly)
- la majorité du temps est investi dans la partie “pro” (RLS/RPC)

### Phase 2 — Skin “idle game” (amélioration visuelle)
- Remplacer/compléter progressivement les SVG par du **pixel art** (packs type Kenney).
- Ajouter des micro-animations CSS/Transitions :
  - `+5 wood` (floating numbers)
  - "sparkle" au craft
  - feedback visuel sur upgrades/déblocages

### Assets & licences
- Favoriser des assets **CC0** (ou licences très permissives) pour éviter les contraintes.
- Si attribution requise (CC-BY), lister explicitement les crédits dans cette doc ou un écran “Crédits”.

---

## Routes (SvelteKit)
Tout le projet IdleCraft vit sous :
- `/lab/idlecraft` (landing + login)

Routes UI (zone app) :
- `/lab/idlecraft/app` : dashboard (ressources, production, craft, missions)
- `/lab/idlecraft/market` : marketplace (browse + post + buy)
- `/lab/idlecraft/leaderboard` : leaderboard
- `/lab/idlecraft/account` : gestion du compte (link providers, password, etc.) *(phase 2)*

Découpage UX recommandé dans `/lab/idlecraft/app` (panneaux) :
- **Production** : affichage des ressources + taux + bouton “Sync offline”.
- **Upgrades** : liste des upgrades disponibles (coûts, effets, locked/unlocked).
- **Craft** : recettes disponibles, inputs/outputs, boutons “Craft x1/x10”.
- **Missions** : missions disponibles + missions actives + boutons start/claim.

Guard : toutes les routes sous `/lab/idlecraft/*` sauf la landing doivent exiger une session.

---

## Structure repo (cohérente avec `/lab/*`)
- `src/routes/lab/idlecraft/*` : pages UI
- `src/lib/demos/idlecraft/*` : logique et conventions IdleCraft
  - `index.ts` : `IDLECRAFT_BASE_PATH` + helpers de paths
  - `server/*` : appels RPC et logique non-UI
  - `db/*` : schéma conceptuel, conventions, queries
  - `ui/*` : composants spécifiques

---

## Modèle de données (Postgres) — MVP “pro”

Décision d’architecture (Option A) :
- `gold` est stocké dans `players` (plus simple/performant pour le leaderboard).
- toutes les autres ressources + items stackables sont stockés dans `inventory_items`.

### 1) `players`
Responsabilité : identité “jeu” + progression principale.
- `id` (uuid)
- `user_id` (uuid) → `auth.users.id` (**unique**)
- `display_name` (text)
- `gold` (bigint, >= 0)
- `gold_per_sec` (bigint/int, >= 0)
- `wood_per_sec` (bigint/int, >= 0)
- `ore_per_sec` (bigint/int, >= 0)
- `last_tick_at` (timestamptz)
- `created_at`, `updated_at`

Indexes :
- leaderboard : index sur `gold DESC`
- unique : `(user_id)`

### 2) `inventory_items`
Responsabilité : inventaire générique (ressources brutes, ressources intermédiaires, produits finis, et items stackables).
- `player_id` (uuid, FK players)
- `item_key` (text, ex: `wood`, `ore`, `food`, `wood_plank`, `iron_ingot`, `rope`)
- `qty` (bigint, >= 0)
- `created_at`, `updated_at`

PK / contraintes :
- PK composite `(player_id, item_key)`
- `qty >= 0`

Note :
- `gold` ne doit pas être stocké dans `inventory_items` (il reste dans `players`).
- ce modèle évite de multiplier les colonnes quand on ajoute des ressources et simplifie fortement `craft_recipes` (inputs/outputs en `item_key`).

### 3) `missions` (catalogue)
Responsabilité : “table de config” lisible publiquement.
- `id` (uuid)
- `key` (text unique)
- `duration_seconds` (int)
- rewards (min/max) : `reward_gold_min/max`, `reward_wood_min/max`, `reward_ore_min/max`

Option “pro” (pour progression) :
- prérequis d’upgrade : `required_upgrade_key` (nullable)
- spécialisation : `reward_focus` (ex: `wood`, `ore`, `gold`)

### 4) `player_missions`
Responsabilité : instances de missions.
- `id` (uuid)
- `player_id` (uuid)
- `mission_id` (uuid)
- `started_at`, `complete_at`
- `claimed_at` nullable

Index : `(player_id, complete_at)`

### 5) `market_listings`
Responsabilité : ventes publiques.
- `id` (uuid)
- `seller_player_id` (uuid)
- `item_key` (text, ex: `wood`, `ore`, `wood_plank`, etc.)
- `qty` (bigint > 0)
- `price_per_unit` (bigint > 0)
- `status` enum/text (`active`|`sold`|`cancelled`)
- `created_at`, `updated_at`

Indexes : `(status, item_key, created_at)`

### 6) `market_trades` (audit)
Responsabilité : historique d’échanges.
- `id` (uuid)
- `listing_id` (uuid)
- `buyer_player_id`, `seller_player_id`
- `item_key`, `qty`, `total_price`
- `created_at`

### 7) `craft_recipes` (catalogue)
Responsabilité : table de configuration (recettes) lisible publiquement.
- `id` (uuid)
- `key` (text unique, ex: `wood_plank`, `iron_ingot`)

Modèle des IO (choisir une approche) :
- soit JSONB : `inputs jsonb`, `outputs jsonb` (les clés sont des `item_key`)
- soit tables liées : `craft_recipe_inputs(recipe_id, item_key, qty)` et `craft_recipe_outputs(recipe_id, item_key, qty)`

### 8) `player_items` (optionnel MVP, utile “pro”)
Responsabilité : items persistants non-stackables / à état (ex: “Hache en fer”, “Mine lvl 2”).

Note : si un item est simplement stackable (ex: `iron_ingot`), il doit aller dans `inventory_items`.

Exemples de modèles possibles :
- `player_items(player_id, item_key, qty)` (si finalement stackable)
- `player_items(id, player_id, item_key, created_at, metadata jsonb)` (si unique/équipable/avec stats)

### 9) Système d’upgrades de farming
Objectif : séparer la configuration des upgrades et l’état du joueur.

`farm_upgrades` (catalogue)
- `id`
- `key` (ex: `mine_t1`, `mine_t2`, `lumberyard_t1`)
- `type` (ex: `mine`, `lumberyard`, `bonus_global_gold`)
- `level` (int)
- coûts (ex) : `base_cost_gold`, `base_cost_wood`, `base_cost_ore`, ...
- effets (ex) : `gold_per_sec_bonus`, `wood_per_sec_bonus`, `ore_per_sec_bonus`, ...

`player_farm_upgrades`
- `player_id`
- `upgrade_id`
- `level_owned` (ou une ligne = un niveau acheté)

Progression par outils (amélioration du farm via craft + prérequis) :
- Idée : certains upgrades de production (ex: `lumberyard_t2`) exigent de posséder un **outil** d’un certain tier (ex: `axe_wood`, puis `axe_stone`).
- Objectif design : donner une “chaîne” logique au craft et au déblocage des ressources.

Exemple de chaîne (bois) :
- Départ : le joueur ne peut fabriquer que des **haches en bois** (`axe_wood`).
- Pour fabriquer `axe_wood`, il faut des **planches** (`wood_plank`).
- Pour fabriquer `wood_plank`, il faut débloquer une **scierie** (upgrade `sawmill_t1`) qui coûte `n` gold.
- Progression : pour fabriquer `axe_stone`, il faut d’abord **débloquer la pierre** (ex: via un upgrade `mine_t1`) et une recette `stone_axe` consommant `stone` + `wood_plank`.

Comment modéliser proprement :
- Recettes (`craft_recipes`) :
  - ajouter un champ de prérequis (ex: `required_upgrade_key` et/ou `required_item_key`) pour verrouiller certaines recettes.
- Outils (non-stackables) :
  - représenter les outils via `player_items` (ex: `axe_wood`, `axe_stone`) plutôt que `inventory_items`.
  - option : `player_items(..., metadata jsonb)` pour stocker tier, durabilité, bonus, etc.
- Upgrades (`farm_upgrades`) :
  - ajouter un champ de prérequis (ex: `required_item_key` ou `required_items jsonb`) permettant d’exiger un outil.

Stratégie de calcul des taux de production (à choisir) :
- **Option A (recommandée)** : matérialiser les taux dans `players` (`gold_per_sec`, `wood_per_sec`, `ore_per_sec`) et les RPC d’upgrade les mettent à jour.
- **Option B** : recalculer à chaque `tick_offline()` via join `player_farm_upgrades` + `farm_upgrades` (vérité unique, mais plus complexe et plus coûteux).

---

## RLS (Row Level Security) — règles
Règle d’or : **le client ne modifie jamais directement** `gold`, inventaires, ou statuts critiques. Tout passe par RPC.

### `players`
- **SELECT** : owner only (`user_id = auth.uid()`)
- **INSERT/UPDATE** : via RPC uniquement

### `inventory_items`
- **SELECT** : owner only (player appartient à `auth.uid()`)
- **INSERT/UPDATE** : via RPC uniquement

### `missions`
- **SELECT** : public (anon + authenticated)
- **INSERT/UPDATE** : admin only (hors scope MVP)

### `player_missions`
- **SELECT** : owner only
- **INSERT/UPDATE** : via RPC (start/claim)

### `market_listings`
- **SELECT** : public sur listings `active` (et optionnellement historique)
- **INSERT** : via RPC (ou strict owner si insert direct)
- **UPDATE** : via RPC (buy/cancel)

### `market_trades`
- **SELECT** : buyer/seller only *(ou public anonymisé en phase 2)*
- **INSERT** : via RPC uniquement

### `craft_recipes`
- **SELECT** : public (catalogue)
- **INSERT/UPDATE** : admin only

### `player_farm_upgrades`
- **SELECT** : owner only (via join `players.user_id = auth.uid()`)
- **INSERT/UPDATE** : via RPC `buy_farm_upgrade`

---

## RPC Postgres (security definer) — design
Pourquoi : garantir des opérations **atomiques** et sûres (transactions) :
- tick offline
- escrow marketplace
- buy listing
- start/claim mission

Le craft et les upgrades de production doivent aussi passer par RPC (débit/crédit + rollback transaction).

### Concept clé
- Une fonction **`security definer`** s’exécute avec les droits de son propriétaire.
- Il faut **valider `auth.uid()`** dans la fonction pour éviter tout abus.
- Chaque RPC doit être **transactionnelle** (BEGIN/COMMIT implicite dans la fonction) et faire des **verrous** (`FOR UPDATE`) sur les lignes critiques.

### RPC MVP (liste)
- `create_player_if_missing(display_name)`
  - crée `players` + (init rows `inventory_items` pour les ressources non-gold) si absent
- `tick_offline()`
  - applique `deltaSeconds = min(now - last_tick_at, 12h)`
  - crédite `gold` dans `players` selon `gold_per_sec`
  - crédite `wood`/`ore` dans `inventory_items` via upsert/incrément (selon `wood_per_sec`, `ore_per_sec`)
  - met à jour `last_tick_at`
- `start_mission(mission_key)`
  - crée une entrée `player_missions` si aucune mission active (ou limite N)
- `claim_mission(player_mission_id)`
  - vérifie `now >= complete_at` et non claimé
  - crédite rewards
  - marque `claimed_at`
- `craft_item(recipe_key, times)`
  - vérifie les quantités disponibles
  - débite les inputs
  - crédite les outputs
  - rollback transaction en cas d’échec (tout ou rien)
- `buy_farm_upgrade(upgrade_key)`
  - vérifie prérequis (niveau précédent, conditions)
  - débite les ressources
  - ajoute / met à jour `player_farm_upgrades`
  - met à jour les taux de production si matérialisés dans `players`
- `post_listing(item_key, qty, price_per_unit)`
  - vérifie stock
  - retire stock (escrow)
  - crée listing `active`
- `buy_listing(listing_id)`
  - verrouille listing
  - vérifie `active`
  - vérifie solvabilité buyer
  - débite `players.gold` (buyer) / crédite `players.gold` (seller)
  - transfère ressource au buyer
  - listing `sold`
  - écrit `market_trades`
- `cancel_listing(listing_id)`
  - seller only
  - rend escrow
  - listing `cancelled`

---

## Anti-triche & cohérence (règles projet)
- **Server-authoritative** : le client demande des actions, le serveur calcule.
- **Cap tick offline** : 12h.
- **Pas d’update direct** sur les colonnes critiques (gold, inventaires, status listings).
- **Transactions** sur marketplace.
- **Audit** minimal via `market_trades` (et plus tard table `events`).

---

## Roadmap
### Phase 1 — Foundations (sécurité + auth)
- Supabase project + providers (Google/Discord/Email)
- Setup SSR auth (cookies)
- Tables + RLS de base
- RPC : `create_player_if_missing`, `tick_offline`
- Dashboard minimal `/app`

### Phase 2 — Gameplay core
- Missions : `start_mission`, `claim_mission`
- Craft : recettes (`craft_recipes`) + RPC `craft_item`
- Upgrades de production : `farm_upgrades` + `player_farm_upgrades` + RPC `buy_farm_upgrade`
- UX feedback (toasts, loading, erreurs)

### Phase 3 — MMO light
- Marketplace complet (post/buy/cancel)
- Leaderboard (top 50)
- Hardening : rate limiting (app-level), tests RLS

### Phase 4 — Portfolio polish
- Page Lab enrichie (IdleCraft card + live + source)
- Docs: sécurité, schéma, diagrammes
- Observabilité (logs, events)

---

## Critères de “done” MVP 1
- Un user peut :
  - se connecter (Google/Discord/Email)
  - obtenir un player unique
  - voir sa progression
  - sync le tick offline
  - lancer/claim une mission
  - crafter (si inclus)
  - consulter le market et acheter/vendre
  - apparaître sur un leaderboard
- Sécurité :
  - RLS empêche la lecture/écriture cross-user
  - aucune écriture critique directe depuis le client
  - marketplace atomique
