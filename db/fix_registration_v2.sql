-- Fix Registration Schema & Constraints
-- 1. Updates profiles table columns
-- 2. Updates subscription_status constraint to allow 'pending'
-- 3. Re-creates registration functions

-- 1. Add missing columns (Safe to re-run)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shop_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gst_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'unverified';

-- 2. Update Constraint to allow 'pending'
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_subscription_status_check;
    END IF;

    -- Add new constraint with 'pending'
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('active', 'expired', 'none', 'pending'));
END $$;

-- 3. Create/Replace Dealer Registration Function
CREATE OR REPLACE FUNCTION public.create_dealer_profile(
  _shop_name text,
  _city text,
  _phone text,
  _whatsapp_number text,
  _gst_number text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, role, shop_name, city, phone, whatsapp_number, gst_number, status, subscription_status, is_verified
  )
  VALUES (
    auth.uid(), 'dealer', _shop_name, _city, _phone, _whatsapp_number, _gst_number, 'unverified', 'pending', false
  )
  ON CONFLICT (id) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    city = EXCLUDED.city,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    gst_number = EXCLUDED.gst_number,
    subscription_status = 'pending'; -- Ensure status is pending on update too
END;
$$;
