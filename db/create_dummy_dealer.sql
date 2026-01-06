-- Requires pgcrypto extension for password hashing
create extension if not exists pgcrypto;

DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
    user_email text := 'dealer@test.com';
BEGIN
    -- 1. Insert into auth.users
    -- This might trigger the auto-creation of a profile depending on your DB setup
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        phone
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        user_email,
        crypt('password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Test Dealer"}',
        false,
        '9876543210'
    );

    -- 2. Update the Profile
    -- Since you have a trigger that creates the profile, we should UPDATE it, not INSERT.
    -- If no trigger exists, we perform an INSERT (Upsert logic).
    INSERT INTO public.profiles (
        id,
        name,
        shop_name,
        phone,
        city,
        address,
        role,
        is_verified,
        subscription_status
    )
    VALUES (
        new_user_id,
        'Test Dealer',
        'Coimbatore Laptop Hub',
        '9876543210',
        'Coimbatore',
        '123 Cross Cut Road, Gandhipuram',
        'dealer',
        true,
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'dealer',
        is_verified = true,
        subscription_status = 'active',
        shop_name = 'Coimbatore Laptop Hub',
        city = 'Coimbatore',
        phone = '9876543210';
    
    RAISE NOTICE 'Dummy dealer created with ID: %', new_user_id;

EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'User dealer@test.com already exists. Updating existing user to dealer status.';
    
    -- Fallback: If user exists, find them and update profile
    UPDATE public.profiles
    SET 
        role = 'dealer',
        is_verified = true,
        subscription_status = 'active',
        shop_name = 'Coimbatore Laptop Hub'
    WHERE id = (SELECT id FROM auth.users WHERE email = user_email);
    
END $$;
