-- Create Requirements Table
create table public.requirements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null, -- e.g., "Need 10x i5 Laptops"
  quantity integer default 1,
  budget text, -- e.g., "50k total"
  description text,
  status text check (status in ('open', 'closed')) default 'open',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.requirements enable row level security;

-- Policies

-- 1. Buyers can insert their own requirements
create policy "Buyers can insert own requirements"
on public.requirements for insert
with check ( auth.uid() = user_id );

-- 2. Buyers can view their own requirements
create policy "Buyers can view own requirements"
on public.requirements for select
using ( auth.uid() = user_id );

-- 3. Dealers and Admins can view ALL open requirements
-- We check existence in 'profiles' table to see if user is a dealer/admin
create policy "Dealers and Admins can view open requirements"
on public.requirements for select
using ( 
  exists (
    select 1 from public.profiles
    where id = auth.uid() 
    and (role = 'dealer' or role = 'admin')
    and is_verified = true
  )
);
