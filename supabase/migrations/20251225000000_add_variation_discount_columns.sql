-- Migration: Add missing columns to product_variations table
-- Run this in your Supabase SQL Editor
-- Created: 2025-12-25

-- Add discount_price column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_variations' 
        AND column_name = 'discount_price'
    ) THEN
        ALTER TABLE public.product_variations 
        ADD COLUMN discount_price DECIMAL(10, 2);
        RAISE NOTICE 'Added discount_price column';
    ELSE
        RAISE NOTICE 'discount_price column already exists';
    END IF;
END $$;

-- Add discount_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_variations' 
        AND column_name = 'discount_active'
    ) THEN
        ALTER TABLE public.product_variations 
        ADD COLUMN discount_active BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added discount_active column';
    ELSE
        RAISE NOTICE 'discount_active column already exists';
    END IF;
END $$;

-- Add quantity_mg column if it doesn't exist (some older schemas may not have it)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_variations' 
        AND column_name = 'quantity_mg'
    ) THEN
        ALTER TABLE public.product_variations 
        ADD COLUMN quantity_mg DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added quantity_mg column';
    ELSE
        RAISE NOTICE 'quantity_mg column already exists';
    END IF;
END $$;

-- Refresh the PostgREST schema cache by reloading
NOTIFY pgrst, 'reload schema';

-- Verify the columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'product_variations'
ORDER BY ordinal_position;
