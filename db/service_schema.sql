-- 1. Update Profiles Table
-- Add pincode column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'pincode') then
        alter table public.profiles add column pincode text;
    end if;
end $$;

-- Update role constraint to include service_engineer
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin', 'dealer', 'user', 'service_engineer'));

-- 2. Create Service Requests Table
create table if not exists public.service_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  address text not null,
  pincode text not null,
  status text check (status in ('open', 'assigned', 'completed', 'cancelled')) default 'open',
  assigned_engineer_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 3. RLS for Service Requests
alter table public.service_requests enable row level security;

-- Users can view/insert their own requests
create policy "Users can view own requests" on public.service_requests for select using (auth.uid() = user_id);
create policy "Users can insert own requests" on public.service_requests for insert with check (auth.uid() = user_id);

-- Admins can view/update all
create policy "Admins can view all requests" on public.service_requests for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all requests" on public.service_requests for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Service Engineers can view assigned requests
create policy "Engineers can view assigned requests" on public.service_requests for select using (
  auth.uid() = assigned_engineer_id
);
-- Engineers can update status of assigned requests
create policy "Engineers can update assigned requests" on public.service_requests for update using (
  auth.uid() = assigned_engineer_id
);

-- 4. RPC to Create Service Engineer
create or replace function create_service_engineer_profile(
  _name text,
  _city text,
  _phone text,
  _whatsapp_number text,
  _pincode text
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.profiles (
    id, role, shop_name, city, phone, whatsapp_number, pincode,
    status, subscription_status, is_verified
  )
  values (
    auth.uid(), 'service_engineer', _name, _city, _phone, _whatsapp_number, _pincode,
    'verified', 'active', true
  )
  on conflict (id) do nothing;
end;
$$;
