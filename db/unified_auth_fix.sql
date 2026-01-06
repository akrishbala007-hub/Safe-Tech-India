-- FINAL UNIFIED AUTH & PROFILE FIX
-- This script fixes the constraints and ensures the trigger uses valid values.

-- 1. Ensure Profiles Table has all necessary columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shop_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gst_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'unverified';

-- 2. Update Role Constraint to include all possible roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'dealer', 'user', 'service_engineer'));

-- 3. Update Status Constraint to include 'pending' if needed, or use 'unverified'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('unverified', 'verified', 'suspended', 'pending'));

-- 4. Update Subscription Status Constraint to include 'pending'
-- This was the cause of the 500 error!
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN ('active', 'expired', 'none', 'pending'));

-- 5. Sophisticated Auto-Registration Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  metadata jsonb := NEW.raw_user_meta_data;
  user_role text := COALESCE(metadata->>'role', 'user');
BEGIN
  INSERT INTO public.profiles (
    id, 
    role, 
    name,
    shop_name, 
    city, 
    phone, 
    whatsapp_number, 
    gst_number,
    is_verified, 
    subscription_status,
    status,
    created_at
  )
  VALUES (
    NEW.id,
    user_role,
    metadata->>'full_name',
    metadata->>'shop_name',
    metadata->>'city',
    metadata->>'phone',
    metadata->>'whatsapp_number',
    metadata->>'gst_number',
    -- Automate verification for regular users, pending for dealers/engineers
    CASE WHEN user_role = 'user' THEN true ELSE false END,
    -- Set active for users, pending for others
    CASE WHEN user_role = 'user' THEN 'active' ELSE 'pending' END,
    -- Initial status
    CASE WHEN user_role = 'user' THEN 'verified' ELSE 'unverified' END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    shop_name = EXCLUDED.shop_name,
    city = EXCLUDED.city,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    gst_number = EXCLUDED.gst_number;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Re-apply the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Permissions
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- 8. Final Clean - Reload Schema (Internal Supabase nudge)
NOTIFY pgrst, 'reload schema';
