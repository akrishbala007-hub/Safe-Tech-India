-- [DANGER] This script clears all data except for Admin users.
-- Run this in the Supabase SQL Editor.

BEGIN;

-- 1. Cleardown public tables dependent on users
DELETE FROM public.service_requests;
DELETE FROM public.leads;

-- 2. Delete products linked to non-admin dealers
DELETE FROM public.products
WHERE dealer_id IN (
    SELECT id FROM public.profiles WHERE role <> 'admin'
);

-- 3. Delete non-admin profiles
DELETE FROM public.profiles
WHERE role <> 'admin';

-- 4. Clean up auth.users
-- This attempts to remove users from the auth schema who no longer have a profile (or who weren't admins)
-- Note: 'auth.users' deletion requires appropriate permissions (Service Role or Dashboard execution)
DELETE FROM auth.users
WHERE id NOT IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
);

COMMIT;

-- Verify results
SELECT count(*) as admin_count FROM public.profiles;
SELECT count(*) as remaining_users FROM auth.users;
