-- FIX ADMIN RLS POLICIES
-- This script adds the missing UPDATE and INSERT policies for administrators.

-- 1. Requirements Table
DROP POLICY IF EXISTS "Admins can update requirements" ON public.requirements;
CREATE POLICY "Admins can update requirements"
ON public.requirements FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. Requirement Dealers Table (for Suggestions)
DROP POLICY IF EXISTS "Admins can manage requirement_dealers" ON public.requirement_dealers;
CREATE POLICY "Admins can manage requirement_dealers"
ON public.requirement_dealers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Service Requests Table
DROP POLICY IF EXISTS "Admins can update service_requests" ON public.service_requests;
CREATE POLICY "Admins can update service_requests"
ON public.service_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Request Dealers Table (for Services)
DROP POLICY IF EXISTS "Admins can manage request_dealers" ON public.request_dealers;
CREATE POLICY "Admins can manage request_dealers"
ON public.request_dealers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Profiles Table (Ensure Admins can view/edit all)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

NOTIFY pgrst, 'reload schema';
