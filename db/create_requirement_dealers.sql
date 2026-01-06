-- Create table for Admin to assign dealers to Buying Requirements (Product Leads)
create table if not exists requirement_dealers (
    id uuid default gen_random_uuid() primary key,
    requirement_id uuid references requirements(id) on delete cascade not null,
    dealer_id uuid references profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    unique(requirement_id, dealer_id)
);

-- Enable RLS
alter table requirement_dealers enable row level security;

-- Policies
create policy "Admins can do everything on requirement_dealers"
    on requirement_dealers for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

create policy "Users can view dealers for their own requirements"
    on requirement_dealers for select
    using (
        exists (
            select 1 from requirements
            where requirements.id = requirement_dealers.requirement_id
            and requirements.user_id = auth.uid()
        )
    );
