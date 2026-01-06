-- Fix create_dealer_profile to enforce role update
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
    role = 'dealer', -- FORCE UPDATE ROLE
    shop_name = EXCLUDED.shop_name,
    city = EXCLUDED.city,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    gst_number = EXCLUDED.gst_number,
    subscription_status = 'pending';
END;
$$;

-- Manually fix the debug user's role
UPDATE public.profiles
SET role = 'dealer'
WHERE shop_name = 'Debug Shop 2';
