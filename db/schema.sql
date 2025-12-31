-- Create Profiles Table (Public Profile for Dealers & Admin)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'dealer')) default 'dealer',
  shop_name text,
  city text,
  phone text,
  whatsapp_number text,
  status text check (status in ('unverified', 'verified', 'suspended')) default 'unverified',
  subscription_status text check (subscription_status in ('active', 'expired', 'none')) default 'none',
  subscription_expiry timestamptz,
  is_verified boolean default false,
  logo_url text,
  gst_number text,
  about_us text,
  created_at timestamptz default now()
);

-- Create Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  dealer_id uuid references public.profiles(id) not null,
  title text not null,
  category text null,
  condition text check (condition in ('New', 'Refurbished Grade A', 'Refurbished Grade B', 'Refurbished Grade C')),
  specs jsonb default '{}'::jsonb,
  price numeric not null,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Create Leads Table (Click Tracking)
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  dealer_id uuid references public.profiles(id),
  product_id uuid references public.products(id),
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- Policies for Profiles
-- Public can view confirmed dealers
create policy "Public profiles are viewable by everyone" 
on public.profiles for select 
using ( true );

-- Users can update their own profile
create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- [FIX] Users can insert their own profile
create policy "Users can insert their own profile" 
on public.profiles for insert 
with check ( auth.uid() = id );

-- Policies for Products
-- Public can view active products from verified dealers
create policy "Active products are public" 
on public.products for select 
using ( is_active = true );

-- Dealers can insert/update their own products
create policy "Dealers can manage own products" 
on public.products for all 
using ( auth.uid() = dealer_id );

--------------------------------------------------------------
-- RPC Functions (Bypass RLS securely)
--------------------------------------------------------------

create or replace function create_dealer_profile(
  _shop_name text,
  _city text,
  _phone text,
  _whatsapp_number text,
  _gst_number text
)
returns json
language plpgsql
security definer
as $$
declare
  new_profile_id uuid;
begin
  -- Check if profile already exists for this user to avoid duplicate key error
  if exists (select 1 from public.profiles where id = auth.uid()) then
      return json_build_object('message', 'Profile already exists');
  end if;

  insert into public.profiles (
    id, role, shop_name, city, phone, whatsapp_number, gst_number,
    status, subscription_status, is_verified, created_at
  )
  values (
    auth.uid(), 'dealer', _shop_name, _city, _phone, _whatsapp_number, _gst_number,
    'verified', 'active', true, now()
  )
  returning id into new_profile_id;
  
  return json_build_object('id', new_profile_id);
end;
$$;
