
-- Force Schema Cache Refresh (Robust Method)

-- 1. Explicitly grant permissions again (just in case)
GRANT ALL ON TABLE public.request_dealers TO authenticated;
GRANT ALL ON TABLE public.request_dealers TO service_role;

-- 2. Force Cache Refresh via Comment
-- Changing a comment is a known trick to force Supabase/PostgREST to refresh its schema cache immediately.
COMMENT ON TABLE public.request_dealers IS 'Links service requests to suggested dealers. Refreshed.';

-- 3. Notify command (again, for good measure)
NOTIFY pgrst, 'reload config';

-- 4. Verify it exists
SELECT * FROM public.request_dealers LIMIT 1;
