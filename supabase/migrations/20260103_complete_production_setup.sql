-- ============================================
-- COMPLETE PRODUCTION DATABASE FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- Created: 2026-01-03
-- ============================================

-- ============================================
-- 1. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;

DELETE FROM public.site_settings;
INSERT INTO public.site_settings (id, value, type, description) VALUES
('site_name', 'Glowform Lab', 'text', 'The name of the website'),
('site_logo', '/assets/logo.jpg', 'image', 'The logo image URL'),
('site_description', 'Where Science Meets Sparkle', 'text', 'Site description'),
('currency', '₱', 'text', 'Currency symbol'),
('currency_code', 'PHP', 'text', 'Currency code'),
('hero_badge_text', '✨ MAGICAL WELLNESS SCIENCE ✨', 'text', 'Hero badge text'),
('hero_title_prefix', 'The New Improved', 'text', 'Hero title prefix'),
('hero_title_highlight', 'You', 'text', 'Hero title highlight'),
('hero_title_suffix', 'Designed for Your Glow-Up Era', 'text', 'Hero title suffix'),
('hero_subtext', 'Where science meets sparkle — wellness designed to help you glow.', 'text', 'Hero subtext'),
('hero_tagline', 'Science-Backed. Lab Tested Quality.', 'text', 'Hero tagline'),
('hero_description', 'Premium peptides and wellness solutions crafted for your transformation journey.', 'text', 'Hero description'),
('hero_accent_color', 'gold-500', 'text', 'Hero accent color'),
('coa_page_enabled', 'true', 'boolean', 'Enable/disable the COA page');

-- ============================================
-- 2. SHIPPING LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.shipping_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.shipping_locations DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.shipping_locations TO anon, authenticated, service_role;

INSERT INTO public.shipping_locations (id, name, fee, is_active, order_index) VALUES
('NCR', 'NCR (Metro Manila)', 75, true, 1),
('LUZON', 'Luzon (Outside NCR)', 100, true, 2),
('VISAYAS_MINDANAO', 'Visayas & Mindanao', 130, true, 3)
ON CONFLICT (id) DO UPDATE SET
    fee = EXCLUDED.fee,
    name = EXCLUDED.name;

-- ============================================
-- 3. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;

-- ============================================
-- 4. PRODUCTS TABLE  
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Uncategorized',
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_price DECIMAL(10, 2),
    discount_start_date TIMESTAMP WITH TIME ZONE,
    discount_end_date TIMESTAMP WITH TIME ZONE,
    discount_active BOOLEAN DEFAULT false,
    purity_percentage DECIMAL(5, 2) DEFAULT 99.0,
    molecular_weight TEXT,
    cas_number TEXT,
    sequence TEXT,
    storage_conditions TEXT DEFAULT 'Store at -20°C',
    inclusions TEXT[],
    stock_quantity INTEGER DEFAULT 0,
    available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    image_url TEXT,
    safety_sheet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;

-- ============================================
-- 5. PRODUCT VARIATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_variations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity_mg DECIMAL(10, 2) NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_price DECIMAL(10, 2),
    discount_active BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.product_variations DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.product_variations TO anon, authenticated, service_role;

-- ============================================
-- 6. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    contact_method TEXT DEFAULT 'phone',
    shipping_address TEXT NOT NULL,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip_code TEXT,
    shipping_country TEXT DEFAULT 'Philippines',
    shipping_barangay TEXT,
    shipping_region TEXT,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    order_items JSONB NOT NULL,
    subtotal DECIMAL(10, 2),
    total_price DECIMAL(10, 2) NOT NULL,
    pricing_mode TEXT DEFAULT 'PHP',
    payment_method_id TEXT,
    payment_method_name TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_proof_url TEXT,
    promo_code_id UUID,
    promo_code TEXT,
    discount_applied DECIMAL(10, 2) DEFAULT 0,
    order_status TEXT DEFAULT 'new',
    notes TEXT,
    admin_notes TEXT,
    tracking_number TEXT,
    tracking_courier TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;

-- ============================================
-- 7. PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    account_number TEXT,
    account_name TEXT,
    qr_code_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payment_methods DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.payment_methods TO anon, authenticated, service_role;

INSERT INTO public.payment_methods (id, name, account_number, account_name, active, sort_order) VALUES
('0a0b0001-0001-4e78-94f8-585d77059001', 'GCash', '', 'Glowform Lab', true, 1),
('0a0b0002-0002-4e78-94f8-585d77059002', 'BDO', '', 'Glowform Lab', true, 2),
('0a0b0003-0003-4e78-94f8-585d77059003', 'Security Bank', '', 'Glowform Lab', true, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFY ALL TABLES CREATED
-- ============================================
SELECT 'site_settings' as table_name, COUNT(*) as rows FROM public.site_settings
UNION ALL SELECT 'shipping_locations', COUNT(*) FROM public.shipping_locations
UNION ALL SELECT 'categories', COUNT(*) FROM public.categories
UNION ALL SELECT 'products', COUNT(*) FROM public.products
UNION ALL SELECT 'orders', COUNT(*) FROM public.orders
UNION ALL SELECT 'payment_methods', COUNT(*) FROM public.payment_methods;
