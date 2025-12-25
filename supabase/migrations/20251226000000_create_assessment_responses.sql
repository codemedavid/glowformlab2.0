-- Migration: Create assessment_responses table
-- Run this in your Supabase SQL Editor
-- Created: 2025-12-26

CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age_range TEXT,
    location TEXT,
    goals TEXT[] DEFAULT '{}',
    medical_history TEXT[] DEFAULT '{}',
    experience_level TEXT,
    preferences JSONB DEFAULT '{}',
    consent_agreed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'new',
    recommendation_generated TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for public access
ALTER TABLE public.assessment_responses DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE public.assessment_responses TO anon, authenticated, service_role;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_responses_email ON public.assessment_responses(email);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_status ON public.assessment_responses(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_created_at ON public.assessment_responses(created_at DESC);

-- Verify table creation
SELECT 'assessment_responses' as table_name, COUNT(*) as row_count FROM public.assessment_responses;
