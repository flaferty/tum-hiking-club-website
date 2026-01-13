-- Seed Script to create an Admin User in Supabase (dummy credentials, change as needed)

-- 1. Create the Admin User in the Auth system
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, instance_id)
VALUES (
    'cc7c6711-7807-4ab2-8527-8d38cabe3ed2', -- Your specific Admin ID
    'admin@example.com',                    -- LOGIN EMAIL
    crypt('password123', gen_salt('bf')),   -- LOGIN PASSWORD
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Local Admin"}',
    now(),
    now(),
    'authenticated',
    '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the User Identity (Required for login to work)
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'cc7c6711-7807-4ab2-8527-8d38cabe3ed2',
    '{"sub":"cc7c6711-7807-4ab2-8527-8d38cabe3ed2","email":"admin@example.com"}',
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (user_id, provider) DO NOTHING;

-- 3. Assign the Admin Role
INSERT INTO public.user_roles (user_id, role)
VALUES ('cc7c6711-7807-4ab2-8527-8d38cabe3ed2', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Create a Profile (So the app doesn't crash looking for a name)
INSERT INTO public.profiles (user_id, full_name, email)
VALUES ('cc7c6711-7807-4ab2-8527-8d38cabe3ed2', 'Local Admin', 'admin@example.com')
ON CONFLICT (user_id) DO NOTHING;