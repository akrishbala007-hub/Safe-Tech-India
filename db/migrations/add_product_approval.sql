-- Add approval_status to products
alter table public.products 
add column approval_status text check (approval_status in ('pending', 'approved', 'rejected')) default 'pending';

-- Update existing products to 'approved' so current site doesn't break
update public.products set approval_status = 'approved';

-- Update RLS: Public can only see APPROVED products
drop policy "Active products are public" on public.products;

create policy "Active approved products are public" 
on public.products for select 
using ( is_active = true and approval_status = 'approved' );

-- Update RLS: Dealers can see their own (even pending)
-- (Existing policy "Dealers can manage own products" covers this via dealer_id check)

-- Update RLS: Admins can see ALL (even pending)
create policy "Admins can view all products"
on public.products for select
using ( 
  exists (
    select 1 from public.profiles
    where id = auth.uid() 
    and role = 'admin'
  )
);
