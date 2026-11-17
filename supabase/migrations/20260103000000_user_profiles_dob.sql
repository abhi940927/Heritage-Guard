-- ==============================================================================
-- ADD DATE OF BIRTH (DOB) TO USER PROFILES & UPDATE AUTH TRIGGER
-- Heritage Site Crowd Management System
-- ==============================================================================

-- 1. Add dob column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dob DATE;

-- 2. Update handle_new_user trigger function to capture dob & metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone_number, dob, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Heritage Explorer'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'phone_number', ''),
        CASE 
            WHEN new.raw_user_meta_data->>'dob' IS NOT NULL AND new.raw_user_meta_data->>'dob' != '' 
            THEN (new.raw_user_meta_data->>'dob')::DATE 
            ELSE NULL 
        END,
        COALESCE(new.raw_user_meta_data->>'role', 'visitor')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = CASE WHEN EXCLUDED.phone_number != '' THEN EXCLUDED.phone_number ELSE public.profiles.phone_number END,
        dob = CASE WHEN EXCLUDED.dob IS NOT NULL THEN EXCLUDED.dob ELSE public.profiles.dob END,
        updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
