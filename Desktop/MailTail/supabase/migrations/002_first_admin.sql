-- Insert first admin user (lennyhuynh526@gmail.com)
-- Run this AFTER creating the admin tables and AFTER the user has signed up

-- Find the user by email and insert as super_admin
INSERT INTO public.admins (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'lennyhuynh526@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- If the user doesn't exist yet, you can run this after they sign up:
-- INSERT INTO public.admins (user_id, role)
-- VALUES ('<user-uuid-here>', 'super_admin');
