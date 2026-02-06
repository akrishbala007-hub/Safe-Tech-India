-- Grant execute permission to public/anon users so homepage can call it
grant execute on function public.get_grouped_products(text, text) to anon;
grant execute on function public.get_grouped_products(text, text) to authenticated;
grant execute on function public.get_grouped_products(text, text) to service_role;

-- Also ensure specific schemas if needed, but 'public' is usually enough
