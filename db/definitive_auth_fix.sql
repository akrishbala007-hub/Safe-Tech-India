-- DEFINITIVE FIX FOR AUTH, ROLES AND RLS RECURSION (ROBUST VERSION)
-- Run this in your Supabase SQL Editor

-- 1. Ensure the Role Constraint is Correct
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'dealer', 'user', 'service_engineer'));

-- 2. Sync Roles into Auth Metadata (CRITICAL for non-recursive RLS)
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

-- 3. Fix Infinite Recursion in Profiles RLS
-- Safely drop ALL variants to prevent "already exists" errors
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

DROP POLICY IF EXISTS "Admins can manage requirement_dealers" ON public.requirement_dealers;
DROP POLICY IF EXISTS "Admins can update requirements" ON public.requirements;
DROP POLICY IF EXISTS "Admins can update service_requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admins can manage request_dealers" ON public.request_dealers;

-- PROFILE POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING ( true );
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ( auth.uid() = id );
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- ADMIN POLICIES FOR OTHER TABLES
CREATE POLICY "Admins can manage requirement_dealers" ON public.requirement_dealers FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
CREATE POLICY "Admins can update requirements" ON public.requirements FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
CREATE POLICY "Admins can update service_requests" ON public.service_requests FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
CREATE POLICY "Admins can manage request_dealers" ON public.request_dealers FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- 4. Robust Sync Trigger (Handles both Inserts and Updates)
CREATE OR REPLACE FUNCTION public.handle_user_sync()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

  INSERT INTO public.profiles (
    id, role, name, shop_name, city, phone, whatsapp_number, gst_number,
    is_verified, subscription_status, status, created_at
  )
  VALUES (
    NEW.id,
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'shop_name',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp_number',
    NEW.raw_user_meta_data->>'gst_number',
    CASE WHEN user_role = 'user' THEN true ELSE false END,
    CASE WHEN user_role = 'user' THEN 'active' ELSE 'pending' END,
    CASE WHEN user_role = 'user' THEN 'verified' ELSE 'unverified' END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = COALESCE(EXCLUDED.name, profiles.name),
    shop_name = COALESCE(EXCLUDED.shop_name, profiles.shop_name),
    city = COALESCE(EXCLUDED.city, profiles.city),
    phone = COALESCE(EXCLUDED.phone, profiles.phone);
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger to handle both insert and update
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;
CREATE TRIGGER on_auth_user_sync
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_sync();

-- 5. Force Schema Reload
NOTIFY pgrst, 'reload schema';
