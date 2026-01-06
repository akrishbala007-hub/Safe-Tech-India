-- 1. Get a valid Requirement ID and Dealer ID to test with
-- Replace these UUIDs with actual ones from your database if known, 
-- or let the subquery find the first available ones.

DO $$
DECLARE
    v_req_id uuid;
    v_dealer_id uuid;
    v_admin_id uuid;
BEGIN
    -- Get logged in admin ID (simulate running as admin)
    -- WARNING: When running in SQL Editor, you are usually 'postgres' (superuser) or the logged-in user.
    -- This test simply tries to INSERT to see if constraints/tables obey.
    
    -- Find a requirement
    SELECT id INTO v_req_id FROM requirements LIMIT 1;
    -- Find a dealer
    SELECT id INTO v_dealer_id FROM profiles WHERE role = 'dealer' LIMIT 1;

    IF v_req_id IS NULL OR v_dealer_id IS NULL THEN
        RAISE NOTICE 'Could not find Requirement or Dealer to test. Req: %, Dealer: %', v_req_id, v_dealer_id;
        RETURN;
    END IF;

    RAISE NOTICE 'Testing Insert for Req: % and Dealer: %', v_req_id, v_dealer_id;

    -- Attempt Insert
    INSERT INTO requirement_dealers (requirement_id, dealer_id)
    VALUES (v_req_id, v_dealer_id)
    ON CONFLICT (requirement_id, dealer_id) DO NOTHING;
    
    RAISE NOTICE 'Insert Successful!';

    -- Check if it exists
    PERFORM 1 FROM requirement_dealers WHERE requirement_id = v_req_id AND dealer_id = v_dealer_id;
    RAISE NOTICE 'Row confirmed in database.';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Insert Failed: %', SQLERRM;
END $$;
