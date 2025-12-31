-- Check for service requests with missing user profiles
-- This helps identify users who have auth accounts but no profiles

-- 1. Find service requests where user has no profile
SELECT 
    sr.id as request_id,
    sr.user_id,
    sr.description,
    sr.address,
    sr.pincode,
    sr.status,
    sr.created_at,
    CASE 
        WHEN p.id IS NULL THEN 'NO PROFILE'
        ELSE 'HAS PROFILE'
    END as profile_status
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
ORDER BY sr.created_at DESC;

-- 2. Count requests with missing profiles
SELECT 
    COUNT(*) as total_requests,
    COUNT(p.id) as requests_with_profile,
    COUNT(*) - COUNT(p.id) as requests_without_profile
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id;

-- 3. Get user IDs that need profiles created
SELECT DISTINCT sr.user_id
FROM service_requests sr
LEFT JOIN profiles p ON sr.user_id = p.id
WHERE p.id IS NULL;

-- 4. OPTIONAL: Create basic profiles for users who submitted requests
-- WARNING: Only run this if you want to auto-create profiles
-- You'll need to update with actual user data

-- Example for one user:
-- INSERT INTO profiles (id, role, name, phone, is_verified, subscription_status)
-- VALUES (
--     'b23f40f1-9b5b-4ae1-9fb8-c8457937ffd8',  -- user_id from service request
--     'user',
--     'Unknown User',  -- Replace with actual name
--     '0000000000',    -- Replace with actual phone
--     true,
--     'active'
-- );
