-- FIX RLS RECURSION
-- This script drops the problematic policy that causes infinite recursion.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Ensure the public policy exists and is correct (covers everyone including admins)
-- If it already exists, this does nothing.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone" 
        ON public.profiles FOR SELECT 
        USING ( true );
    END IF;
END $$;

-- Verify other policies on profiles to ensure no other recursion
-- (We'll just stick to the known one for now as it's the most likely culprit)

NOTIFY pgrst, 'reload schema';
