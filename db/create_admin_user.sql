-- Promote user to admin
UPDATE profiles
SET role = 'admin', is_verified = true
WHERE id IN (SELECT id FROM auth.users WHERE email = 'test_user_flow_2@example.com');
