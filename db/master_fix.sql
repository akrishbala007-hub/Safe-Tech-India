-- MASTER FIX FOR PRODUCTS & STORAGE PERMISSIONS
-- Run this ENTIRE SCRIPT in the Supabase SQL Editor

BEGIN;


-- 0. SYNC ROLES TO METADATA (CRITICAL STEP)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, role FROM public.profiles LOOP
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', r.role)
    WHERE id = r.id;
  END LOOP;
END $$;

-- 1. ENABLE RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. RESET PRODUCT POLICIES (DROP ALL TO BE SAFE)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Dealers can manage own products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.products;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.products;

-- 3. RE-CREATE PRODUCT POLICIES (CORRECT PERMISSIONS)

-- A. PUBLIC VIEW (Anyone can see active items)
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- B. ADMIN FULL ACCESS (The Critical Part)
CREATE POLICY "Admins can manage all products" 
ON public.products FOR ALL 
USING ( 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

-- C. DEALER ACCESS (Manage their own)
CREATE POLICY "Dealers can manage own products" 
ON public.products FOR ALL 
USING ( dealer_id = auth.uid() );


-- 4. STORAGE SETUP (Handle "Already Exists" Errors)
-- Create bucket if missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- RESET STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects; -- Drop potential auto-gen policies

-- RE-CREATE STORAGE POLICIES

-- A. PUBLIC VIEW IMAGES
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

-- B. ADMIN FULL CONTROL
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

CREATE POLICY "Admin Manage" 
ON storage.objects FOR UPDATE 
USING ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

COMMIT;

-- 5. Force Schema Reload
NOTIFY pgrst, 'reload schema';
