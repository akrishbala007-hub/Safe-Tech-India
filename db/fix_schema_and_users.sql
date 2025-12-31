-- CORRECT fix for existing users
-- The profiles table has 'shop_name' not 'name', and 'phone' exists

-- Step 1: Check current schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Step 2: Add 'name' column if it doesn't exist (for regular users)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
END $$;

-- Step 3: Now create profiles for users with service requests
INSERT INTO public.profiles (id, role, name, phone, is_verified, subscription_status)
SELECT DISTINCT 
    sr.user_id,
    'user',
    'Service Request User',
    '0000000000',
    true,
    'active'
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone;

-- Step 4: Verify
SELECT 
    sr.id,
    sr.description,
    p.name,
    p.phone,
    p.role
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id;
