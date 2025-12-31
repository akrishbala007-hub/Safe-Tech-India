-- Comprehensive fix for all unknown users in service requests

-- Step 1: Find all service requests with missing user profiles
SELECT 
    sr.id as request_id,
    sr.user_id,
    sr.description,
    sr.address,
    sr.pincode,
    CASE 
        WHEN p.id IS NULL THEN '❌ NO PROFILE'
        ELSE '✅ HAS PROFILE'
    END as profile_status,
    p.name as current_name
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
ORDER BY sr.created_at DESC;

-- Step 2: Get unique user IDs that need profiles
SELECT DISTINCT sr.user_id
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
WHERE p.id IS NULL;

-- Step 3: Create profiles for ALL users who submitted service requests but don't have profiles
INSERT INTO public.profiles (id, role, name, phone, is_verified, subscription_status, created_at)
SELECT DISTINCT 
    sr.user_id,
    'user',
    'Service Request User',  -- Default name
    '0000000000',            -- Default phone
    true,
    'active',
    NOW()
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify all service requests now have user profiles
SELECT 
    sr.id as request_id,
    sr.description,
    sr.address,
    p.name as user_name,
    p.phone as user_phone,
    CASE 
        WHEN p.id IS NULL THEN '❌ STILL MISSING'
        ELSE '✅ FIXED'
    END as status
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
ORDER BY sr.created_at DESC;

-- Step 5: Count results
SELECT 
    COUNT(*) as total_requests,
    COUNT(p.id) as requests_with_profile,
    COUNT(*) - COUNT(p.id) as requests_still_missing_profile
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id;
