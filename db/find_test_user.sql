
-- Find the user who owns the most recently responded request
SELECT 
    sr.id as request_id, 
    sr.description, 
    sr.status,
    p.id as user_id, 
    p.name as user_name, 
    p.phone as user_phone,
    u.email as user_email
FROM service_requests sr
JOIN profiles p ON sr.user_id = p.id
LEFT JOIN auth.users u ON p.id = u.id
WHERE sr.status = 'responded'
ORDER BY sr.created_at DESC
LIMIT 5;
