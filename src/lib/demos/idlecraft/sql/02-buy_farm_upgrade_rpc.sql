-- ========================================
-- RPC: buy_farm_upgrade
-- Permet à un joueur d'acheter une upgrade de ferme
-- ========================================

CREATE OR REPLACE FUNCTION buy_farm_upgrade(p_upgrade_key TEXT)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    new_gold BIGINT,
    new_gold_per_sec BIGINT,
    new_wood_per_sec BIGINT,
    new_ore_per_sec BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_player_id UUID;
    v_upgrade_id UUID;
    v_cost_gold BIGINT;
    v_cost_wood BIGINT;
    v_cost_ore BIGINT;
    v_gold_bonus BIGINT;
    v_wood_bonus BIGINT;
    v_ore_bonus BIGINT;
    v_required_key TEXT;
    v_already_owned BOOLEAN;
BEGIN
    -- Vérifier que l'utilisateur est connecté
    IF v_user_id IS NULL THEN
        RETURN QUERY SELECT false, 'UNAUTHORIZED'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
        RETURN;
    END IF;
    
    -- Récupérer l'ID du joueur
    SELECT id INTO v_player_id 
    FROM players 
    WHERE user_id = v_user_id;
    
    IF v_player_id IS NULL THEN
        RETURN QUERY SELECT false, 'PLAYER_NOT_FOUND'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
        RETURN;
    END IF;
    
    -- Récupérer les infos de l'upgrade
    SELECT id, cost_gold, cost_wood, cost_ore, 
           gold_per_sec_bonus, wood_per_sec_bonus, ore_per_sec_bonus,
           required_upgrade_key
    INTO v_upgrade_id, v_cost_gold, v_cost_wood, v_cost_ore,
         v_gold_bonus, v_wood_bonus, v_ore_bonus, v_required_key
    FROM farm_upgrades 
    WHERE key = p_upgrade_key;
    
    IF v_upgrade_id IS NULL THEN
        RETURN QUERY SELECT false, 'UPGRADE_NOT_FOUND'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
        RETURN;
    END IF;
    
    -- Vérifier que le joueur ne possède pas déjà cette upgrade
    SELECT EXISTS(SELECT 1 FROM player_farm_upgrades 
                  WHERE player_id = v_player_id AND upgrade_id = v_upgrade_id)
    INTO v_already_owned;
    
    IF v_already_owned THEN
        RETURN QUERY SELECT false, 'UPGRADE_ALREADY_OWNED'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
        RETURN;
    END IF;
    
    -- Vérifier les prérequis si nécessaire
    IF v_required_key IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM player_farm_upgrades pfu
            JOIN farm_upgrades fu ON pfu.upgrade_id = fu.id
            WHERE pfu.player_id = v_player_id AND fu.key = v_required_key
        ) THEN
            RETURN QUERY SELECT false, 'PREREQUISITE_NOT_MET'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
            RETURN;
        END IF;
    END IF;
    
    -- Transaction atomique : vérifier les coûts et débourser
    -- Verrouiller la ligne du joueur pour éviter les race conditions
    LOCK TABLE players IN ROW SHARE MODE;
    
    -- Vérifier que le joueur a assez de ressources
    IF NOT EXISTS (
        SELECT 1 FROM players 
        WHERE id = v_player_id 
        AND gold >= v_cost_gold
        AND (SELECT COALESCE(SUM(qty), 0) FROM inventory_items 
             WHERE player_id = v_player_id AND item_key = 'wood') >= v_cost_wood
        AND (SELECT COALESCE(SUM(qty), 0) FROM inventory_items 
             WHERE player_id = v_player_id AND item_key = 'ore') >= v_cost_ore
    ) THEN
        RETURN QUERY SELECT false, 'INSUFFICIENT_RESOURCES'::TEXT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT;
        RETURN;
    END IF;
    
    -- Débourser les ressources
    UPDATE players 
    SET gold = gold - v_cost_gold,
        gold_per_sec = gold_per_sec + v_gold_bonus,
        wood_per_sec = wood_per_sec + v_wood_bonus,
        ore_per_sec = ore_per_sec + v_ore_bonus,
        updated_at = NOW()
    WHERE id = v_player_id;
    
    -- Débourser le bois et le minerai s'il y en a
    IF v_cost_wood > 0 THEN
        UPDATE inventory_items 
        SET qty = qty - v_cost_wood
        WHERE player_id = v_player_id AND item_key = 'wood';
    END IF;
    
    IF v_cost_ore > 0 THEN
        UPDATE inventory_items 
        SET qty = qty - v_cost_ore
        WHERE player_id = v_player_id AND item_key = 'ore';
    END IF;
    
    -- Ajouter l'upgrade au joueur
    INSERT INTO player_farm_upgrades (player_id, upgrade_id)
    VALUES (v_player_id, v_upgrade_id);
    
    -- Retourner le succès et les nouvelles valeurs
    RETURN QUERY 
    SELECT true, 
           'UPGRADE_PURCHASED'::TEXT,
           gold,
           gold_per_sec,
           wood_per_sec,
           ore_per_sec
    FROM players 
    WHERE id = v_player_id;
    
END;
$$;

-- Commentaire pour documentation
COMMENT ON FUNCTION buy_farm_upgrade IS 'Achète une upgrade de ferme pour le joueur authentifié. Transaction sécurisée avec vérification des coûts et prérequis.';
