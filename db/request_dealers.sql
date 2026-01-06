-- Create table for Admin to suggest specific dealers for a user request
create table if not exists request_dealers (
    id uuid default gen_random_uuid() primary key,
    request_id uuid references service_requests(id) on delete cascade not null,
    dealer_id uuid references profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure unique pair of request and dealer
    unique(request_id, dealer_id)
);

-- Enable RLS
alter table request_dealers enable row level security;

-- Policies

-- 1. Admins can view and insert/delete all
create policy "Admins can do everything on request_dealers"
    on request_dealers for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            andprofiles.role = 'admin'
        )
    );

-- 2. Users can view dealers suggested for their OWN requests
create policy "Users can view dealers for their requests"
    on request_dealers for select
    using (
        exists (
            select 1 from service_requests
            where service_requests.id = request_dealers.request_id
            and service_requests.user_id = auth.uid()
        )
    );

-- 3. Dealers can view requests they are suggested for (Optional, good for future)
create policy "Dealers can view requests they are suggested for"
    on request_dealers for select
    using (
        dealer_id = auth.uid()
    );

-- Add 'responded' status check constraint if not exists (optional, handled in app logic usually)
-- But let's add a helper function to 'respond' to a request by adding dealers
create or replace function admin_suggest_dealers(
    _request_id uuid,
    _dealer_ids uuid[]
)
returns void
language plpgsql
security definer
as $$
begin
    -- Check if admin
    if not exists (
        select 1 from profiles 
        where id = auth.uid() and role = 'admin'
    ) then
        raise exception 'Access denied';
    end if;

    -- Insert dealers
    insert into request_dealers (request_id, dealer_id)
    select _request_id, unnest(_dealer_ids)
    on conflict (request_id, dealer_id) do nothing;

    -- Update request status to 'responded'
    update service_requests
    set status = 'responded'
    where id = _request_id;
end;
$$;
