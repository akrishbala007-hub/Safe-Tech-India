-- Create Requirements Table if it doesn't exist
create table if not exists public.requirements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  quantity integer default 1,
  budget text,
  description text,
  status text check (status in ('open', 'closed')) default 'open',
  created_at timestamptz default now()
);

-- Add brand column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'requirements' and column_name = 'brand') then
        alter table public.requirements add column brand text;
    end if;
end $$;

-- Enable RLS
alter table public.requirements enable row level security;

-- Policies (Drop existing to avoid conflicts if running multiple times)
drop policy if exists "Buyers can insert own requirements" on public.requirements;
drop policy if exists "Buyers can view own requirements" on public.requirements;
drop policy if exists "Dealers and Admins can view open requirements" on public.requirements;
drop policy if exists "Admins can view all requirements" on public.requirements;

-- 1. Buyers can insert their own requirements
create policy "Buyers can insert own requirements"
on public.requirements for insert
with check ( auth.uid() = user_id );

-- 2. Buyers can view their own requirements
create policy "Buyers can view own requirements"
on public.requirements for select
using ( auth.uid() = user_id );

-- 3. Dealers and Admins can view ALL requirements
create policy "Dealers and Admins can view all requirements"
on public.requirements for select
using ( 
  exists (
    select 1 from public.profiles
    where id = auth.uid() 
    and (role = 'dealer' or role = 'admin')
  )
);
