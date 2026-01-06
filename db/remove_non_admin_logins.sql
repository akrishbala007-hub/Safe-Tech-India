-- Database Cleanup: Remove all users except Admin
-- Admin Email: test_user_flow_2@example.com

DO $$ 
DECLARE 
    admin_id UUID;
BEGIN
    -- 1. Get the Admin ID
    SELECT id INTO admin_id FROM auth.users WHERE email = 'test_user_flow_2@example.com';

    IF admin_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found with email test_user_flow_2@example.com';
    END IF;

    -- 2. Delete from child tables that reference profiles or users
    -- Delete from leads
    DELETE FROM public.leads WHERE dealer_id != admin_id;

    -- Delete from products
    DELETE FROM public.products WHERE dealer_id != admin_id;

    -- Delete from request_dealers (if exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'request_dealers') THEN
        DELETE FROM public.request_dealers WHERE dealer_id != admin_id;
    END IF;

    -- Delete from service_requests (if exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_requests') THEN
        DELETE FROM public.service_requests WHERE user_id != admin_id AND (assigned_engineer_id != admin_id OR assigned_engineer_id IS NULL);
    END IF;

    -- 3. Delete from public.profiles
    DELETE FROM public.profiles WHERE id != admin_id;

    -- 4. Delete from auth.users
    -- Note: This is where the actual login is removed. 
    -- We delete where id is NOT the admin_id.
    DELETE FROM auth.users WHERE id != admin_id;

    RAISE NOTICE 'Cleanup complete. Only Admin (ID: %) remains.', admin_id;
END $$;

-- Verify results
SELECT id, email, created_at FROM auth.users;
SELECT id, role, shop_name FROM public.profiles;
