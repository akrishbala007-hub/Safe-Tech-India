-- 1. Check if table 'requirement_dealers' exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'requirement_dealers') THEN
        RAISE EXCEPTION 'Table requirement_dealers does NOT exist!';
    ELSE
        RAISE NOTICE 'Table requirement_dealers exists.';
    END IF;
END $$;

-- 2. Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'requirement_dealers';

-- 3. Check Admin Policy
SELECT * FROM pg_policies WHERE tablename = 'requirement_dealers';

-- 4. Check Current User Role (Run this as the logged-in user in SQL Editor)
select auth.uid(), role from profiles where id = auth.uid();
