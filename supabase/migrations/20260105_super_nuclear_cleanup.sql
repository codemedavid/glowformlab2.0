-- ==============================================================================
-- SUPER NUCLEAR CLEANUP (LAST RESORT)
-- This script DISABLES everything, WIPES data, and attempts to restore sanity.
-- ==============================================================================

BEGIN;

-- 1. DISABLE TRIGGERS & RLS (Temporarily)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_rules DISABLE ROW LEVEL SECURITY;

-- 2. DROP CONSTRAINTS (To avoid foreign key blocks)
ALTER TABLE public.product_variations DROP CONSTRAINT IF EXISTS product_variations_product_id_fkey;
ALTER TABLE public.recommendation_rules DROP CONSTRAINT IF EXISTS recommendation_rules_product_id_fkey;
ALTER TABLE public.recommendation_rules DROP CONSTRAINT IF EXISTS recommendation_rules_recommended_product_id_fkey;

-- 3. WIPE DATA (TRUNCATE is faster and ignores some locks)
TRUNCATE TABLE public.recommendation_rules CASCADE;
TRUNCATE TABLE public.product_variations CASCADE;
TRUNCATE TABLE public.products CASCADE;

-- 4. RESTORE CONSTRAINTS (So future inserts work)
ALTER TABLE public.product_variations 
    ADD CONSTRAINT product_variations_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

ALTER TABLE public.recommendation_rules 
    ADD CONSTRAINT recommendation_rules_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

ALTER TABLE public.recommendation_rules 
    ADD CONSTRAINT recommendation_rules_recommended_product_id_fkey 
    FOREIGN KEY (recommended_product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

-- 5. RE-ENABLE RLS (With permissive policies)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_rules ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
DROP POLICY IF EXISTS "Enable all for anon" ON public.products;
CREATE POLICY "Enable all for anon" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for anon" ON public.product_variations;
CREATE POLICY "Enable all for anon" ON public.product_variations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

COMMIT;

-- Verify empty
SELECT COUNT(*) as products_remaining FROM public.products;
