-- ROBUST FIX: Check 'profiles' table directly (Bypasses Stale JWT Issues)

BEGIN;

-- 1. PRODUCTS TABLE POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop potential old policies
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Admin Policy (Checks profiles table directly)
CREATE POLICY "Admins can manage all products" 
ON public.products FOR ALL 
USING ( 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public View Policy
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);


-- 2. STORAGE POLICIES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Admin Upload (Checks profiles table directly)
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'products' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admin Manage (Checks profiles table directly)
CREATE POLICY "Admin Manage" 
ON storage.objects FOR UPDATE 
USING ( 
  bucket_id = 'products' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admin Delete (Checks profiles table directly)
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( 
  bucket_id = 'products' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public Access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

COMMIT;
NOTIFY pgrst, 'reload schema';
