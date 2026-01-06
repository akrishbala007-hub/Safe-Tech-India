-- Add brand column to requirements table
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'requirements' and column_name = 'brand') then
        alter table public.requirements add column brand text;
    end if;
end $$;
