-- Add courier column to orders table for tracking (LBC or J&T)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier TEXT DEFAULT 'jnt';

-- Add comment
COMMENT ON COLUMN public.orders.courier IS 'Courier service used: jnt (J&T Express) or lbc (LBC Express)';
