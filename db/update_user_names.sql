-- Update the existing user profiles to add names
-- Based on the screenshot, we have 2 users with NULL names

-- Update all user profiles that have NULL names
UPDATE public.profiles 
SET name = 'Service Request User'
WHERE role = 'user' AND name IS NULL;

-- Update phone numbers that are NULL
UPDATE public.profiles 
SET phone = '0000000000'
WHERE role = 'user' AND phone IS NULL;

-- Verify the update
SELECT id, name, phone, role 
FROM public.profiles 
WHERE role = 'user';
