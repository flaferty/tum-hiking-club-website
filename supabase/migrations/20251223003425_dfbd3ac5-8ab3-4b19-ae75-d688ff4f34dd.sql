-- Add admin role for the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('cc7c6711-7807-4ab2-8527-8d38cabe3ed2', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;