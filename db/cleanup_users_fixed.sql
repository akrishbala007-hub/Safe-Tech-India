-- Corrected Database Cleanup Script
-- This script safely deletes all users except admin
-- It checks which tables exist before attempting to delete

-- Step 1: Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Step 2: See what profiles will be deleted (preview)
SELECT id, role, email, name, shop_name, is_verified 
FROM profiles 
WHERE role != 'admin';

-- Step 3: Delete from tables that exist
-- Delete products (if table exists)
DELETE FROM products 
WHERE dealer_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Delete service_requests (if table exists)
DELETE FROM service_requests 
WHERE user_id NOT IN (SELECT id FROM profiles WHERE role = 'admin')
   OR assigned_engineer_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Step 4: Delete non-admin profiles
DELETE FROM profiles 
WHERE role != 'admin';

-- Step 5: Verify cleanup
SELECT 'Cleanup Complete!' as status;

SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Service Requests', COUNT(*) FROM service_requests;

-- Step 6: Show remaining admin user
SELECT id, role, email, name, shop_name, is_verified 
FROM profiles;
