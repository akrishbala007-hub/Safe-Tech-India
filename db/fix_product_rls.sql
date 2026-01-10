-- Enable RLS on Products if not already enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Remove existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Dealers can manage own products" ON public.products;

-- 1. Everyone can view ACTIVE products
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- 2. Admins can do EVERYTHING on products
CREATE POLICY "Admins can manage all products" 
ON public.products FOR ALL 
USING ( 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

-- 3. Dealers can manage their OWN products
CREATE POLICY "Dealers can manage own products" 
ON public.products FOR ALL 
USING ( dealer_id = auth.uid() );

-- 4. Also ensure storage policies for images if needed (optional but good practice)
-- (Assuming 'products' bucket exists)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );
