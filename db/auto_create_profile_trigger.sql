-- Automatic Profile Creation Trigger
-- This ensures every user who signs up gets a profile automatically

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the user
  INSERT INTO public.profiles (id, role, is_verified, subscription_status, created_at)
  VALUES (
    NEW.id,
    'user',  -- Default role is 'user'
    true,    -- Users are verified by default
    'active', -- Users have active subscription by default
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- 4. Test the trigger (optional - comment out if not testing)
-- To test, try creating a new user through the registration page
-- The profile should be created automatically

-- 5. Verify existing users have profiles
-- Check if there are any auth users without profiles
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE 
        WHEN p.id IS NULL THEN 'MISSING PROFILE'
        ELSE 'HAS PROFILE'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 6. OPTIONAL: Create profiles for existing users who don't have them
-- WARNING: Only run this once to fix existing users
INSERT INTO public.profiles (id, role, is_verified, subscription_status, created_at)
SELECT 
    u.id,
    'user',
    true,
    'active',
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
