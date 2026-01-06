-- Ensure 'inclusions' column exists in products table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'inclusions'
    ) THEN
        ALTER TABLE public.products ADD COLUMN inclusions TEXT[] DEFAULT NULL;
    END IF;
END $$;
