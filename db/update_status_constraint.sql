
-- Fix for ERROR: new row for relation "service_requests" violates check constraint "service_requests_status_check"
-- We need to add 'responded' to the allowed list of statuses.

ALTER TABLE public.service_requests
DROP CONSTRAINT IF EXISTS service_requests_status_check;

ALTER TABLE public.service_requests
ADD CONSTRAINT service_requests_status_check
CHECK (status IN ('open', 'assigned', 'completed', 'cancelled', 'responded'));
