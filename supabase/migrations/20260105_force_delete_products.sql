-- ==============================================================================
-- FORCE DELETE ALL PRODUCTS (Brute Force)
-- Use this if the standard TRUNCATE failed.
-- ==============================================================================

BEGIN;

-- 1. Delete Link Tables (Recommendation Rules)
DELETE FROM public.recommendation_rules;

-- 2. Delete Child Tables (Variations)
DELETE FROM public.product_variations;

-- 3. Delete Optional Tables (safely)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        DELETE FROM public.cart_items;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'wishlist') THEN
        DELETE FROM public.wishlist;
    END IF;
END $$;

-- 4. Delete The Products
DELETE FROM public.products;

COMMIT;
