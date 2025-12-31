-- SIMPLE CLEANUP SCRIPT - Use this one!
-- Just deletes non-admin profiles and related data from existing tables

-- Delete products from non-admin dealers
DELETE FROM products 
WHERE dealer_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Delete service requests
DELETE FROM service_requests 
WHERE user_id NOT IN (SELECT id FROM profiles WHERE role = 'admin')
   OR assigned_engineer_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Delete non-admin profiles
DELETE FROM profiles 
WHERE role != 'admin';

-- Verify results
SELECT 'Cleanup Complete!' as message;
SELECT COUNT(*) as remaining_profiles FROM profiles;
SELECT * FROM profiles;
