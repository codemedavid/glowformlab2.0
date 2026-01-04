-- ============================================
-- DEEP DIAGNOSTIC & NUCLEAR FIX
-- Run this script in Supabase SQL Editor
-- This script proactively searches for ANY foreign key referencing products
-- and forces them to ON DELETE CASCADE
-- ============================================

DO $$
DECLARE
    r RECORD;
    v_sql TEXT;
    fixed_count INTEGER := 0;
BEGIN
    RAISE NOTICE '🚀 Starting Deep Diagnostic & Fix...';

    -- 1. SEARCH FOR ANY TABLE REFERENCING products(id)
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
        RAISE NOTICE '🔍 Found dependency: Table %.% references products via %', 
            r.table_schema, r.table_name, r.constraint_name;
            
        -- Force Re-create with CASCADE
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.constraint_name);
            
            v_sql := format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.products(id) ON DELETE CASCADE', 
                            r.table_schema, r.table_name, r.constraint_name, r.local_column);
            EXECUTE v_sql;
            
            fixed_count := fixed_count + 1;
            RAISE NOTICE '   ✅ Fixed % (Added ON DELETE CASCADE)', r.constraint_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '   ❌ Failed to fix %: %', r.constraint_name, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '---------------------------------------------------';
    RAISE NOTICE '🏁 Diagnostic complete. Fixed % constraints.', fixed_count;
    
    -- 2. VERIFY recommendation_rules (Since it was the main culprit)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'recommendation_rules') THEN
         RAISE NOTICE '📋 Table recommendation_rules exists.';
    ELSE
         RAISE NOTICE '⚠️ Table recommendation_rules MISSING (Did the previous script fail?)';
    END IF;

END $$;
