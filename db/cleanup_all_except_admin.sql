
-- ⚠️ DANGER: This script deletes data! ⚠️
-- It will clear ALL Service Requests, PRODUCTS, and Users/Dealers EXCEPT the Admin.

BEGIN;

-- 1. Remove all dealer suggestions/assignments
DELETE FROM public.request_dealers;

-- 2. Remove all Service Requests
DELETE FROM public.service_requests;

-- 3. Remove all Products (Fixes Foreign Key Error: products_dealer_id_fkey)
DELETE FROM public.products;

-- 4. Remove all Profiles that are NOT Admin
-- This removes them from the "Public" table, so they won't appear in the dashboard lists.
DELETE FROM public.profiles 
WHERE role != 'admin';

COMMIT;

-- Verify what's left
SELECT role, count(*) FROM public.profiles GROUP BY role;
