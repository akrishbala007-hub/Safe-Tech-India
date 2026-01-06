-- FIX ADMIN FUNCTIONS (Standardized Names)
-- This script (re)defines the RPC functions using parameter names that match the frontend (_dealer_id, _status).

-- 0. Drop existing functions to avoid parameter name mismatch errors
DROP FUNCTION IF EXISTS public.toggle_dealer_verification(uuid);
DROP FUNCTION IF EXISTS public.toggle_dealer_subscription(uuid, text);

-- 1. Function to toggle dealer verification status
CREATE OR REPLACE FUNCTION public.toggle_dealer_verification(_dealer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
BEGIN
  -- Perform a check to ensure the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can perform this action.';
  END IF;

  -- Update the dealer profile using explicit table aliases to avoid ambiguity
  UPDATE public.profiles AS prof
  SET 
    is_verified = NOT prof.is_verified,
    status = CASE WHEN NOT prof.is_verified THEN 'verified' ELSE 'unverified' END
  WHERE prof.id = _dealer_id;
END;
$$;

-- 2. Function to toggle dealer subscription status
CREATE OR REPLACE FUNCTION public.toggle_dealer_subscription(_dealer_id uuid, _status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can perform this action.';
  END IF;

  -- Update subscription status
  UPDATE public.profiles AS prof
  SET subscription_status = _status
  WHERE prof.id = _dealer_id;
END;
$$;

-- 3. Ensure the authenticated role has permission to call these functions
GRANT EXECUTE ON FUNCTION public.toggle_dealer_verification(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_dealer_subscription(uuid, text) TO authenticated;

-- 4. Reload schema nudge
NOTIFY pgrst, 'reload schema';
