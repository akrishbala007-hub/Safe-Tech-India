-- FIX SUGGEST DEALERS FUNCTIONALITY
-- This script fixes constraints and schema issues that prevent suggesting dealers.

-- 1. Add email column to profiles and update trigger
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  metadata jsonb := NEW.raw_user_meta_data;
  user_role text := COALESCE(metadata->>'role', 'user');
BEGIN
  INSERT INTO public.profiles (
    id, 
    email,
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
    NEW.email,
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
    email = EXCLUDED.email,
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

-- 2. Update existing profiles with emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 3. Fix Requirements Table Status Constraint
ALTER TABLE public.requirements DROP CONSTRAINT IF EXISTS requirements_status_check;
ALTER TABLE public.requirements ADD CONSTRAINT requirements_status_check 
CHECK (status IN ('open', 'closed', 'responded'));

-- 4. Fix Service Requests Table Status Constraint
ALTER TABLE public.service_requests DROP CONSTRAINT IF EXISTS service_requests_status_check;
ALTER TABLE public.service_requests ADD CONSTRAINT service_requests_status_check 
CHECK (status IN ('open', 'assigned', 'completed', 'cancelled', 'responded'));

-- 5. Permissions & Reload
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.requirements TO authenticated;
GRANT ALL ON public.service_requests TO authenticated;
GRANT ALL ON public.requirement_dealers TO authenticated;

NOTIFY pgrst, 'reload schema';
