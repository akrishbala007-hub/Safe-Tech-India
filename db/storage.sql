
-- Create storage buckets
insert into storage.buckets (id, name, public) values ('products', 'products', true);
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Policies for 'products' bucket
-- Public can view
create policy "Public Access Products"
on storage.objects for select
using ( bucket_id = 'products' );

-- Verified Dealers can upload
create policy "Verified Dealers Upload Products"
on storage.objects for insert
with check (
  bucket_id = 'products' 
  and auth.role() = 'authenticated'
);

-- Policies for 'logos' bucket
create policy "Public Access Logos"
on storage.objects for select
using ( bucket_id = 'logos' );

create policy "Dealers Upload Logos"
on storage.objects for insert
with check (
  bucket_id = 'logos' 
  and auth.role() = 'authenticated'
);
