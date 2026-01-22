-- Migration: Fix Category Permissions
-- Description: Grant read/write access to public for categories table (matches frontend-only auth)

-- 1. Enable RLS (Good practice even if we make it public)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Create a permissive policy for ALL operations
-- Drop policy if exists to avoid errors on re-run
DROP POLICY IF EXISTS "Allow public access to categories" ON public.categories;

CREATE POLICY "Allow public access to categories"
ON public.categories
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Explicitly grant permissions to anon and authenticated roles
GRANT ALL ON public.categories TO anon;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
