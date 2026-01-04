-- ==============================================================================
-- DANGER: DELETE ALL PRODUCTS
-- This script will wipe ALL products from the database.
-- Because of 'CASCADE', it will also delete:
--   - All Product Variations
--   - All Recommendation Rules
--   - All Cart Items linking to these products
--   - All Order Items linking to these products (if constraints allow)
-- ==============================================================================

BEGIN;

-- TRUNCATE is faster and cleaner for "Delete All", and CASCADE ensures
-- it wipes all dependent data respecting foreign keys.
-- We use truncate on the main table.
TRUNCATE TABLE public.products CASCADE;

-- If for some reason TRUNCATE is blocked by permissions or complex locks,
-- we fallback to a standard DELETE which triggers the ON DELETE CASCADE constraints
-- we just fixed in the previous script.
-- DELETE FROM public.products; 

COMMIT;
