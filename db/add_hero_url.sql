-- Add hero_url for customizable profile banner
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hero_url text;

COMMENT ON COLUMN public.profiles.hero_url IS 'URL to the custom banner/hero image for the shop profile';
