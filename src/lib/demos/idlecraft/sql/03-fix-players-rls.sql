-- ========================================
-- Fix RLS policies for players table
-- ========================================

-- Supprimer les policies existantes sur players si elles existent
DROP POLICY IF EXISTS "Players can view own data" ON players;
DROP POLICY IF EXISTS "Players can insert own data" ON players;
DROP POLICY IF EXISTS "Players can update own data" ON players;

-- Créer les policies correctes pour la table players
-- Un joueur peut voir ses propres données
CREATE POLICY "Players can view own data" ON players
    FOR SELECT USING (user_id = auth.uid());

-- Un joueur peut insérer ses propres données (via createPlayerIfMissing)
CREATE POLICY "Players can insert own data" ON players
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Un joueur peut mettre à jour ses propres données (gold, upgrades, etc.)
CREATE POLICY "Players can update own data" ON players
    FOR UPDATE USING (user_id = auth.uid());

-- Un joueur peut supprimer son propre compte (pour le reset de test)
CREATE POLICY "Players can delete own data" ON players
    FOR DELETE USING (user_id = auth.uid());

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
