-- ============================================
-- FIX ALL PRODUCT FOREIGN KEYS
-- Run this script in Supabase SQL Editor to fix
-- "409 Conflict" errors when deleting products
-- Created: 2026-01-05
-- ============================================

DO $$
DECLARE
    r RECORD;
    v_sql TEXT;
BEGIN
    RAISE NOTICE 'Starting scan for Foreign Keys referencing public.products...';

    FOR r IN
        SELECT
            tc.table_schema,
            tc.table_name,
            tc.constraint_name,
            kcu.column_name AS local_column
        FROM
            information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE
            tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'products'
            AND ccu.table_schema = 'public'
    LOOP
        RAISE NOTICE 'Found dependency: constraint % on table %.% (column %)', 
            r.constraint_name, r.table_schema, r.table_name, r.local_column;
        
        -- 1. Drop the existing strict constraint
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.constraint_name);
        
        -- 2. Re-create the constraint with ON DELETE CASCADE
        v_sql := format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.products(id) ON DELETE CASCADE', 
                        r.table_schema, r.table_name, r.constraint_name, r.local_column);
        
        EXECUTE v_sql;
        
        RAISE NOTICE '✅ Updated % to ON DELETE CASCADE', r.constraint_name;
    END LOOP;

    RAISE NOTICE 'All product dependencies updated successfully.';
END $$;
