-- Fix for requirement_dealers table and permissions

-- 1. Ensure table exists
create table if not exists requirement_dealers (
    id uuid default gen_random_uuid() primary key,
    requirement_id uuid references requirements(id) on delete cascade not null,
    dealer_id uuid references profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    unique(requirement_id, dealer_id)
);

-- 2. Enable RLS
alter table requirement_dealers enable row level security;

-- 3. Drop existing policies to avoid conflicts/duplicates
drop policy if exists "Admins can do everything on requirement_dealers" on requirement_dealers;
drop policy if exists "Users can view dealers for their own requirements" on requirement_dealers;

-- 4. Create Admin Policy (Full Access)
create policy "Admins can do everything on requirement_dealers"
    on requirement_dealers for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- 5. Create User Policy (View Only for their requirements)
create policy "Users can view dealers for their own requirements"
    on requirement_dealers for select
    using (
        exists (
            select 1 from requirements
            where requirements.id = requirement_dealers.requirement_id
            and requirements.user_id = auth.uid()
        )
    );

-- 6. Grant permissions (Explicitly grant to authenticated role)
grant all on requirement_dealers to authenticated;
grant all on requirement_dealers to service_role;

-- 7. Verify Profiles Policy potentially blocking Admin check (Optional safety fix)
-- Ensure Admins can read all profiles to pass the "exists" check above
create policy "Admins can view all profiles"
on profiles for select
using (
    exists (
        select 1 from profiles as p
        where p.id = auth.uid()
        and p.role = 'admin'
    )
);
