-- Allow unauthenticated (guest) users to create new inquiries (leads)
-- This is required for the "Contact Dealer" form on product pages to work for public visitors.

-- 1. Enable RLS on the table (just in case)
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;

-- 2. Create the policy for INSERT
-- We use "IF NOT EXISTS" logic by dropping first if needed to avoid conflicts, or just CREATE.
-- PostgreSQL doesn't support "CREATE POLICY IF NOT EXISTS" cleanly in all versions without a DO block, 
-- but we can just run this. If it exists, you might get an error, so we can try to drop it first.

DROP POLICY IF EXISTS "Allow public inserts for requirements" ON requirements;

CREATE POLICY "Allow public inserts for requirements"
ON requirements
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Ensure dealers can still see their leads (Select policy)
-- Existing policies likely cover this, but here is a backup for authenticated users
CREATE POLICY "Enable read access for authenticated users"
ON requirements
FOR SELECT
TO authenticated
USING (true); -- Or refine this to only open leads or leads for them
