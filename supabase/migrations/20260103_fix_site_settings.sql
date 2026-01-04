-- ============================================
-- FIX SITE SETTINGS - Run this in Supabase SQL Editor
-- This will add the missing site settings data
-- ============================================

-- First, make sure the table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;

-- Delete existing data to avoid conflicts
DELETE FROM public.site_settings;

-- Insert all settings (this WILL work because we deleted first)
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
('hero_subtext', 'Where science meets sparkle — wellness designed to help you glow with confidence.', 'text', 'Hero subtext'),
('hero_tagline', 'Science-Backed. Lab Tested Quality.', 'text', 'Hero tagline'),
('hero_description', 'Premium peptides and wellness solutions crafted for your transformation journey.', 'text', 'Hero description'),
('hero_accent_color', 'gold-500', 'text', 'Hero accent color'),
('coa_page_enabled', 'true', 'boolean', 'Enable/disable the COA page');

-- Verify the data was inserted
SELECT id, value FROM public.site_settings ORDER BY id;
