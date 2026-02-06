-- RPC: Get Grouped Products
-- Returns unique titles with min price and count of available units
create or replace function get_grouped_products(
  search_query text default '',
  city_filter text default ''
)
returns table (
  title text,
  min_price numeric,
  stock_count bigint,
  image_url text, -- Take the first/best image
  dealer_count bigint,
  product_ids uuid[] -- Array of IDs in this group
)
language plpgsql
as $$
begin
  return query
  select 
    p.title,
    min(p.price) as min_price,
    count(p.id) as stock_count,
    max(p.image_url) as image_url, -- Simple aggregation for image
    count(distinct p.dealer_id) as dealer_count,
    array_agg(p.id) as product_ids
  from 
    public.products p
  join 
    public.profiles d on p.dealer_id = d.id
  where 
    p.is_active = true 
    and p.approval_status = 'approved'
    and (search_query = '' or p.title ilike '%' || search_query || '%')
    and (city_filter = '' or d.city ilike '%' || city_filter || '%')
  group by 
    p.title
  order by 
    stock_count desc;
end;
$$;
