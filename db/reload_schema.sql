
-- Run this to force Supabase to refresh its schema cache
-- This fixes error: "Could not find the table 'public.request_dealers' in the schema cache" (PGRST205)

NOTIFY pgrst, 'reload config';
