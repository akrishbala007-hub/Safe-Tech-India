-- ADD SLUG COLUMN TO PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- FUNCTION TO GENERATE SLUG
CREATE OR REPLACE FUNCTION public.slugify(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- POPULATE EXISTING SLUGS
UPDATE public.profiles 
SET slug = slugify(COALESCE(shop_name, name, id::text))
WHERE slug IS NULL;

-- ENSURE SLUGS ARE UNIQUE (If multiple shops have the same name, append part of ID)
UPDATE public.profiles p1
SET slug = slug || '-' || left(id::text, 4)
WHERE EXISTS (
  SELECT 1 FROM public.profiles p2 
  WHERE p1.slug = p2.slug AND p1.id <> p2.id
);

-- UPDATE TRIGGER TO AUTO-GENERATE SLUG
CREATE OR REPLACE FUNCTION public.handle_user_sync()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
  generated_slug text;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  generated_slug := slugify(COALESCE(NEW.raw_user_meta_data->>'shop_name', NEW.raw_user_meta_data->>'full_name', NEW.id::text));

  INSERT INTO public.profiles (
    id, role, name, shop_name, city, phone, whatsapp_number, gst_number,
    is_verified, subscription_status, status, created_at, slug
  )
  VALUES (
    NEW.id,
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'shop_name',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp_number',
    NEW.raw_user_meta_data->>'gst_number',
    CASE WHEN user_role = 'user' THEN true ELSE false END,
    CASE WHEN user_role = 'user' THEN 'active' ELSE 'pending' END,
    CASE WHEN user_role = 'user' THEN 'verified' ELSE 'unverified' END,
    NOW(),
    generated_slug
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = COALESCE(EXCLUDED.name, profiles.name),
    shop_name = COALESCE(EXCLUDED.shop_name, profiles.shop_name),
    city = COALESCE(EXCLUDED.city, profiles.city),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    slug = COALESCE(EXCLUDED.slug, profiles.slug);
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FORCE RELOAD
NOTIFY pgrst, 'reload schema';
