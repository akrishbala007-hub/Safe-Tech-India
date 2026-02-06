-- Make user_id optional in requirements table to allow guest inquiries
-- This fixes the "null value in column user_id... violates not-null constraint" error

ALTER TABLE requirements ALTER COLUMN user_id DROP NOT NULL;

-- Optional: Verify RLS policy for public (guest) inserts exists (from previous step)
-- DROP POLICY IF EXISTS "Allow public inserts for requirements" ON requirements;
-- CREATE POLICY "Allow public inserts for requirements" ON requirements FOR INSERT TO public WITH CHECK (true);
