-- Create a storage bucket for products
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

-- Policy: Admin can upload images
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

-- Policy: Admin can update/delete images
DROP POLICY IF EXISTS "Admin Manage" ON storage.objects;
CREATE POLICY "Admin Manage" 
ON storage.objects FOR UPDATE 
USING ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( 
  bucket_id = 'products' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
);
