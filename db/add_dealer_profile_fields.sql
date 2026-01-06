-- Add new columns for dealer profile
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS instagram_link text,
ADD COLUMN IF NOT EXISTS facebook_link text,
ADD COLUMN IF NOT EXISTS youtube_link text;

-- Notify user of changes (optional, using a comment)
COMMENT ON COLUMN public.profiles.address IS 'Store physical address of the shop';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to the profile/shop image';
