-- ========================================
-- IdleCraft - Système d'upgrades de production
-- ========================================

-- Table catalogue des upgrades disponibles
-- Cette table est publique (lecture seule) car elle contient la configuration du jeu
CREATE TABLE IF NOT EXISTS farm_upgrades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'gold_mine', 'lumberyard', 'stone_quarry', etc.
    level INTEGER NOT NULL DEFAULT 1,
    
    -- Coûts pour acheter cette upgrade
    cost_gold BIGINT NOT NULL DEFAULT 0,
    cost_wood BIGINT NOT NULL DEFAULT 0,
    cost_ore BIGINT NOT NULL DEFAULT 0,
    
    -- Effets de cette upgrade sur la production
    gold_per_sec_bonus BIGINT NOT NULL DEFAULT 0,
    wood_per_sec_bonus BIGINT NOT NULL DEFAULT 0,
    ore_per_sec_bonus BIGINT NOT NULL DEFAULT 0,
    
    -- Prérequis (upgrade précédente nécessaire)
    required_upgrade_key TEXT NULL,
    
    -- Métadonnées
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- nom de l'icône Lucide
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des upgrades possédés par les joueurs
-- Contient l'état d'achat de chaque upgrade par chaque joueur
CREATE TABLE IF NOT EXISTS player_farm_upgrades (
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    upgrade_id UUID NOT NULL REFERENCES farm_upgrades(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (player_id, upgrade_id)
);

-- Activer RLS sur les deux tables
ALTER TABLE farm_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_farm_upgrades ENABLE ROW LEVEL SECURITY;

-- Policies pour farm_upgrades (catalogue public)
-- Tout le monde peut lire le catalogue des upgrades
CREATE POLICY "Public read access to farm upgrades" ON farm_upgrades
    FOR SELECT USING (true);

-- Personne ne peut modifier le catalogue (admin seulement)
CREATE POLICY "No insert access to farm upgrades" ON farm_upgrades
    FOR INSERT WITH CHECK (false);
CREATE POLICY "No update access to farm upgrades" ON farm_upgrades
    FOR UPDATE USING (false);
CREATE POLICY "No delete access to farm upgrades" ON farm_upgrades
    FOR DELETE USING (false);

-- Policies pour player_farm_upgrades (données joueur)
-- Un joueur ne peut voir que ses propres upgrades
CREATE POLICY "Players can read own upgrades" ON player_farm_upgrades
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM players WHERE user_id = auth.uid()
        )
    );

-- Seules les RPC peuvent insérer/mettre à jour (pas d'accès direct)
CREATE POLICY "No direct insert access to player upgrades" ON player_farm_upgrades
    FOR INSERT WITH CHECK (false);
CREATE POLICY "No direct update access to player upgrades" ON player_farm_upgrades
    FOR UPDATE USING (false);
CREATE POLICY "No direct delete access to player upgrades" ON player_farm_upgrades
    FOR DELETE USING (false);

-- Index pour optimiser les performances
CREATE INDEX idx_farm_upgrades_type_level ON farm_upgrades(type, level);
CREATE INDEX idx_farm_upgrades_key ON farm_upgrades(key);
CREATE INDEX idx_player_farm_upgrades_player_id ON player_farm_upgrades(player_id);

-- Insérer quelques upgrades de base pour tester
INSERT INTO farm_upgrades (key, type, level, cost_gold, gold_per_sec_bonus, name, description, icon) VALUES
('gold_mine_t1', 'gold_mine', 1, 100, 1, 'Mine d''or Niv.1', 'Augmente la production d''or de 1/s', 'Gem'),
('gold_mine_t2', 'gold_mine', 2, 500, 3, 'Mine d''or Niv.2', 'Augmente la production d''or de 3/s', 'Gem'),
('gold_mine_t3', 'gold_mine', 3, 2000, 10, 'Mine d''or Niv.3', 'Augmente la production d''or de 10/s', 'Gem'),
('lumberyard_t1', 'lumberyard', 1, 150, 1, 'Scierie Niv.1', 'Augmente la production de bois de 1/s', 'Trees'),
('lumberyard_t2', 'lumberyard', 2, 750, 3, 'Scierie Niv.2', 'Augmente la production de bois de 3/s', 'Trees'),
('stone_quarry_t1', 'stone_quarry', 1, 200, 1, 'Carrière Niv.1', 'Augmente la production de pierre de 1/s', 'Mountain')
ON CONFLICT (key) DO NOTHING;

-- Prérequis : les upgrades de niveau 2 nécessitent le niveau 1
UPDATE farm_upgrades SET required_upgrade_key = 'gold_mine_t1' WHERE key = 'gold_mine_t2';
UPDATE farm_upgrades SET required_upgrade_key = 'gold_mine_t2' WHERE key = 'gold_mine_t3';
UPDATE farm_upgrades SET required_upgrade_key = 'lumberyard_t1' WHERE key = 'lumberyard_t2';
