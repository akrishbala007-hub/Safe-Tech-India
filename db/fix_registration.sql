-- Fix Registration Schema
-- Adds missing columns to profiles and ensures RPC functions exist.
-- Simplified to avoid PL/pgSQL block errors.

-- 1. Add missing columns to profiles table using standard SQL
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shop_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gst_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'unverified';

-- 2. Create/Replace Dealer Registration Function
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
    id,
    role,
    shop_name,
    city,
    phone,
    whatsapp_number,
    gst_number,
    status,
    subscription_status,
    is_verified
  )
  VALUES (
    auth.uid(),
    'dealer',
    _shop_name,
    _city,
    _phone,
    _whatsapp_number,
    _gst_number,
    'unverified',
    'pending',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    city = EXCLUDED.city,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    gst_number = EXCLUDED.gst_number;
END;
$$;

-- 3. Create/Replace User Registration Function
CREATE OR REPLACE FUNCTION public.create_user_profile(
  _name text,
  _phone text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    role,
    name,
    phone,
    is_verified,
    subscription_status
  )
  VALUES (
    auth.uid(),
    'user',
    _name,
    _phone,
    true,
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone;
END;
$$;
