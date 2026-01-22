-- Migration: Add 3 Placeholder Categories
-- Description: Inserts specific placeholder categories into the 'categories' table.

INSERT INTO public.categories (id, name, icon, sort_order, active)
VALUES 
    ('peptides', 'Peptides', '🧪', 10, true),
    ('supplements', 'Supplements', '💊', 20, true),
    ('accessories', 'Accessories', '💉', 30, true)
ON CONFLICT (id) DO NOTHING;
