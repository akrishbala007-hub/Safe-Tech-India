-- Add phone column to service_requests table
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS phone text;
