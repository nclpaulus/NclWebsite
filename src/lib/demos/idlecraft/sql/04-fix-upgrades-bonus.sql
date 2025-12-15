-- ========================================
-- Fix les bonus de production pour les upgrades
-- ========================================

-- Corriger la scierie pour qu'elle donne du bois et non de l'or
UPDATE farm_upgrades 
SET gold_per_sec_bonus = 0, wood_per_sec_bonus = 1 
WHERE key = 'lumberyard_t1';

UPDATE farm_upgrades 
SET gold_per_sec_bonus = 0, wood_per_sec_bonus = 3 
WHERE key = 'lumberyard_t2';

-- Corriger la carrière pour qu'elle donne de la pierre (minerai) et non de l'or
UPDATE farm_upgrades 
SET gold_per_sec_bonus = 0, ore_per_sec_bonus = 1 
WHERE key = 'stone_quarry_t1';

-- Vérification des corrections
SELECT key, name, gold_per_sec_bonus, wood_per_sec_bonus, ore_per_sec_bonus 
FROM farm_upgrades 
WHERE type IN ('lumberyard', 'stone_quarry');
