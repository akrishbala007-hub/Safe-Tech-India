-- Add contact columns to requirements table
alter table public.requirements 
add column if not exists user_name text,
add column if not exists user_phone text,
add column if not exists city text;
