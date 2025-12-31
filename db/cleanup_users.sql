-- Database Cleanup Script
-- This script deletes all users except admin from the Verified IT database

-- IMPORTANT: Run this in your Supabase SQL Editor
-- This will help resolve the registration loop issues by starting fresh

-- Step 1: Delete all profiles except admin
-- First, let's see what we have
SELECT id, role, email, name, shop_name, is_verified 
FROM profiles 
WHERE role != 'admin';

-- Step 2: Delete non-admin profiles
DELETE FROM profiles 
WHERE role != 'admin';

-- Step 3: Verify only admin remains
SELECT id, role, email, name, shop_name, is_verified 
FROM profiles;

-- Note: Supabase Auth users need to be deleted from the Supabase Dashboard
-- Go to: Authentication > Users > Select users > Delete
-- Or use the Supabase Management API

-- Step 4: Reset any related tables (if needed)
-- Delete products from non-admin dealers
DELETE FROM products 
WHERE dealer_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Delete service requests
DELETE FROM service_requests 
WHERE user_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Delete requirements
DELETE FROM requirements 
WHERE user_id NOT IN (SELECT id FROM profiles WHERE role = 'admin');

-- Step 5: Verify cleanup
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Service Requests', COUNT(*) FROM service_requests
UNION ALL
SELECT 'Requirements', COUNT(*) FROM requirements;
