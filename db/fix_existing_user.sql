-- Fix the existing user who submitted the service request
-- User ID: b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8

-- 1. Check if this user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE id = 'b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8';

-- 2. Create profile for this user
INSERT INTO public.profiles (
    id, 
    role, 
    name, 
    phone, 
    is_verified, 
    subscription_status,
    created_at
)
VALUES (
    'b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8',
    'user',
    'User',  -- You can update this later
    '0000000000',  -- You can update this later
    true,
    'active',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    is_verified = EXCLUDED.is_verified,
    subscription_status = EXCLUDED.subscription_status;

-- 3. Verify the profile was created
SELECT 
    p.id,
    p.role,
    p.name,
    p.phone,
    p.is_verified,
    p.subscription_status
FROM public.profiles p
WHERE p.id = 'b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8';

-- 4. Verify service request now has user info
SELECT 
    sr.id,
    sr.description,
    sr.address,
    sr.pincode,
    sr.status,
    p.name as user_name,
    p.phone as user_phone
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
WHERE sr.user_id = 'b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8';
