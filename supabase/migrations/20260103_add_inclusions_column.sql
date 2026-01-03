-- ============================================
-- Add inclusions column to products table
-- Run this in Supabase SQL Editor FIRST
-- Created: 2026-01-03
-- ============================================

-- Add the inclusions column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'inclusions'
    ) THEN
        ALTER TABLE public.products ADD COLUMN inclusions TEXT[];
        RAISE NOTICE 'Added inclusions column to products table';
    ELSE
        RAISE NOTICE 'inclusions column already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products' 
AND column_name = 'inclusions';
