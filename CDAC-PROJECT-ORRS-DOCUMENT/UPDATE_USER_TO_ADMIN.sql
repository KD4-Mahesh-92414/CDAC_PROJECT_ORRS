-- =====================================================
-- Update User to Admin Role
-- =====================================================
-- This script updates an existing user to have ADMIN role
-- Replace 'your-email@example.com' with the actual email of the user you want to make admin
-- =====================================================

-- Option 1: Update by email
UPDATE users 
SET role = 'ROLE_ADMIN' 
WHERE email = 'your-email@example.com';

-- Option 2: Update by user_id
-- UPDATE users 
-- SET role = 'ROLE_ADMIN' 
-- WHERE user_id = 1;

-- Verify the update
SELECT user_id, full_name, email, role, status 
FROM users 
WHERE email = 'your-email@example.com';
